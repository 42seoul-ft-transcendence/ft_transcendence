import Component from "../../core/Component.js";
// import Button from "../../components/Button.js"
import Navbar from "../../components/Navbar.js";
import Pong from "../../components/Pong.js";


export default class Home extends Component {
  template() {
    return ``;
  }

  mounted() {
    const $pong = document.createElement('canvas');

    this.$target.append($pong);
    new Navbar(this.$target);
    new Pong($pong);
  }
}

// export default class Home extends Component {
//   setup() {
//     this.state = {
//       isLogin: false
//     }
//   }
//   template() {

//       return /* html */ `
//         <div class="row w-100 align-items-center p-5 bg-white rounded-3 shadow-lg">
//           <div class="col-2"></div>
//           <div class="col-8 text-center">
//             <h1 class="fw-bold p-3" style="font-size: 3rem;">Pong Game</h1>
//           </div>
//           <div class="col-2"></div>
//           <div id='btn-container' class="col-12 d-flex justify-content-center">
//           </div>
//         </div>
//       `;
//   // }

//   mounted() {
//     if (this.state)
//     new Button(this.$target.querySelector('#btn-container'), {
//       text: 'Play',
//       class: 'btn btn-lg btn-outline-primary mt-5 shadow-sm'
//     });
//   }

//   setEvent() {
//     this.addEvent('click', 'button', (event) => {
//       event.preventDefault();
//       window.location.hash = '#/login';
//     })
//   }
// }

