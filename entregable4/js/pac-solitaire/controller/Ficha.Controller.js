import { FichaModel } from "../model/Ficha.Model.js";
import { FichaView } from "../view/Ficha.View.js";
export class FichaController {
      constructor(){
            this.model = new FichaModel();
            this.view = new FichaView();
      }
}
export default FichaController;