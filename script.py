import numpy as np
LATITUDE = -9.55766947266527

def calcular_irradiancia_inclinada(irrad, dia_ano, hora):

    # Declinação solar
    declinacao = 23.45 * np.sin(np.radians(360 * (284 + dia_ano)/365))

    # Ângulo zenital
    theta_z = np.degrees(np.arccos(
        np.sin(np.radians(LATITUDE)) * np.sin(np.radians(declinacao)) +
        np.cos(np.radians(LATITUDE)) * np.cos(np.radians(declinacao)) *
        np.cos(np.radians(15 * (hora - 12)))
    ))

    # Fator de correção para inclinação igual à latitude
    fator_correcao = np.cos(np.radians(theta_z - LATITUDE)) / np.cos(np.radians(theta_z))

    return irrad * fator_correcao
