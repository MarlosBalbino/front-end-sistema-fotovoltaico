// Entradas
var MESES = ['jan', 'fev', 'mar', 'abr'];
var dados_est = {
    dados1: { jan: 1, fev: 2 },
    dados2: { mar: 3, abr: "4" }
};
// Lógica
var irradiancias = {};
var _loop_1 = function (chave, valores) {
    irradiancias[chave] = MESES
        .map(function (mes) { return valores[mes]; })
        .filter(function (v) { return v !== undefined; });
};
for (var _i = 0, _a = Object.entries(dados_est); _i < _a.length; _i++) {
    var _b = _a[_i], chave = _b[0], valores = _b[1];
    _loop_1(chave, valores);
}
// Saída
console.log("irradiancias:", irradiancias);
// const irradiancias: DataPoint[] = meses.map((mes) => {
//   const ponto: DataPoint = { mes };
//   Object.entries(dados_est).forEach(([chave, valores]) => {
//     const valor = valores[mes];
//     ponto[chave] = typeof valor === "string" 
//       ? parseNumberFromString(valor) 
//       : (valor as number);
//   });
//   return ponto;
// });
