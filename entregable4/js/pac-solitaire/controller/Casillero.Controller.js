import { CasilleroModel } from "../model/Casillero.Model.js";
import { CasilleroView } from "../view/Casillero.View.js";

export class CasilleroController {
      constructor(){
            this.model = new CasilleroModel();
            this.view = new CasilleroView();
      }
}
export default CasilleroController;