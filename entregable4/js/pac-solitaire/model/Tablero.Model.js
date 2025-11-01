import { CasilleroModel } from "./Casillero.Model.js";
export class TableroModel {
      constructor() {
            this.casilleros = [];
            this.inicializar();
      }

      inicializar() {
            const layout = [
                  [-1, -1, 1, 1, 1, -1, -1],
                  [-1, -1, 1, 1, 1, -1, -1],
                  [ 1,  1, 1, 1, 1,  1,  1],
                  [ 1,  1, 1, 0, 1,  1,  1],
                  [ 1,  1, 1, 1, 1,  1,  1],
                  [-1, -1, 1, 1, 1, -1, -1],
                  [-1, -1, 1, 1, 1, -1, -1]
            ];

            for (let y = 0; y < layout.length; y++) {
                  for (let x = 0; x < layout[y].length; x++) {
                        if (layout[y][x] !== -1) {
                              this.casilleros.push(new CasilleroModel(x, y, layout[y][x] === 1));
                        }
                  }
            }
      }

      obtenerCasilleros() {
            return this.casilleros;
      }

}

export default TableroModel;