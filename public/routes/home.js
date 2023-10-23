const template = document.createElement("template");
template.innerHTML = `
<style>
</style>
<div>
 <h1>Home</h1>
 <div>
   Hello Page1
 </div>
</div>
`;

export class HomeComponent extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    let clone = template.content.cloneNode(true);
    shadowRoot.append(clone);
  }

  static get observedAttributes() {
    return [];
  }

  connectedCallback() {}

  disconnectedCallback() {}

  adoptedCallback() {}

  attributeChangedCallback(name, oldValue, newValue) {}
}

const selector = "app-home";
const cmp = customElements.get(selector);
if (!cmp) {
  customElements.define(selector, HomeComponent);
}
