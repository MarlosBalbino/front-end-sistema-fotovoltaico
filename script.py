# script.py (versão completa)
import sys
import json
import numpy as np
from scipy.optimize import fsolve

# Constantes físicas
k = 1.380649e-23        # Constante de Boltzmann [J/K]
q = 1.602176634e-19     # Carga do elétron [C]
T_ref = 25.0            # Temperatura de referência STC [°C]

def extract_parameters(Isc, Voc, Imp, Vmp, Ns, T0=T_ref):
    """
    Resolve simultaneamente as Eq.(12), (18) e (19) do artigo
    para extrair Rs, Rsh e A a partir de Isc, Voc, Imp, Vmp e Ns.
    """
    def residuals(vars):
        Rs, Rsh, A = vars
        T_K = T0 + 273.15
        Vt = A * k * T_K / q
        I0_term = Isc - (Voc - Isc*Rs)/Rsh
        exp_mpp = np.exp((Vmp + Imp*Rs - Voc)/(Ns*Vt))

        # Eq.(12)
        f1 = Imp - (Isc - (Vmp + Imp*Rs - Isc*Rs)/Rsh - I0_term * exp_mpp)

        # Eq.(18): dP/dV@MPP = 0
        num = -(Isc*Rsh - Voc + Isc*Rs)*exp_mpp/(Ns*Vt*Rsh) - 1/Rsh
        den = 1 + (Isc*Rsh - Voc + Isc*Rs)*exp_mpp/(Ns*Vt*Rsh) + Rs/Rsh
        f2 = Imp + Vmp*(num/den)

        # Eq.(19): dI/dV@Isc = -1/Rsh
        exp_sc = np.exp((Isc*Rs - Voc)/(Ns*Vt))
        num_sc = -(Isc*Rsh - Voc + Isc*Rs)*exp_sc/(Ns*Vt*Rsh) - 1/Rsh
        den_sc = 1 + (Isc*Rsh - Voc + Isc*Rs)*exp_sc/(Ns*Vt*Rsh) + Rs/Rsh
        f3 = num_sc/den_sc + 1/Rsh

        return [f1, f2, f3]

    guess = [0.5, 1000.0, 1.4]     # chutes iniciais razoáveis
    Rs, Rsh, A = fsolve(residuals, guess)
    return Rs, Rsh, A
if __name__ == "__main__":
    try:
        data = json.loads(sys.argv[1])
        Rs, Rsh, A = extract_parameters(
            Isc=data["Isc"],
            Voc=data["Voc"],
            Imp=data["Imp"],
            Vmp=data["Vmp"],
            Ns=data["Ns"],
        )
        print(json.dumps({
            "Rs": float(Rs),
            "Rsh": float(Rsh),
            "A": float(A),
            "success": True
        }))
    except Exception as e:
        print(json.dumps({
            "success": False,
            "error": str(e)
        }))