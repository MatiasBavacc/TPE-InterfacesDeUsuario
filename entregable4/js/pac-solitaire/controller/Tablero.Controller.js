import { TableroModel } from '../model/Tablero.Model.js';
import { TableroView } from '../view/Tablero.View.js';

export class TableroController {
      constructor(){
            this.model = new TableroModel();
            this.view = new TableroView();
      }
}

export default TableroController;