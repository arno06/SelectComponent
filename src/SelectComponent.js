class SelectComponent {
    constructor(pElement) {
        this.element = pElement;
        this.element.setAttribute("multiple", "multiple");
        this.element.style.display = "none";
        this.parent = this.element.parentNode;
        this.options = this.element.querySelectorAll("option");
        let ct = 1;
        this.selectedOptions = Array.from(this.options).filter((pOption)=>{
            pOption.setAttribute("id", pElement.getAttribute("id") + "_" + ct);
            ct++;
            return pOption.hasAttribute("selected");
        });
        this.unselectedOptions = Array.from(this.options).filter((pOption)=>{
            return !pOption.hasAttribute("selected");
        });
        this.build();
    }

    build() {
        let availableOptions = "<div class='scomponent-options available' data-label='Disponibles'>" + (this.unselectedOptions.map(function (pOption) {
            return "<div class='option' data-value='" + pOption.getAttribute("value") + "' data-id='" + pOption.getAttribute("id") + "'>" + pOption.innerHTML + "</div>";
        })).join("") + '<div></div></div>';
        let selectedOptions = "<div class='scomponent-options selected' data-label='S&eacute;lectionn&eacute;s'>" + (this.selectedOptions.map(function (pOption) {
            return "<div class='option' data-value='" + pOption.getAttribute("value") + "' data-id='" + pOption.getAttribute("id") + "'>" + pOption.innerHTML + "</div>";
        })).join("") + '<div></div></div>';
        this.parent.innerHTML += "<div class='scomponent-container'>" +
            availableOptions +
            "<div class='scomponent-actions selection'><button class='select'></button><button class='unselect'></button></div>" +
            selectedOptions +
            "<div class='scomponent-actions ordering'><button class='up'></button><button class='down'></button></div>" +
            "</div>";
        this.parent.querySelector("button.select").addEventListener('click', this.select.bind(this));
        this.parent.querySelector("button.unselect").addEventListener('click', this.unselect.bind(this));
        this.parent.querySelector("button.up").addEventListener('click', this.up.bind(this));
        this.parent.querySelector("button.down").addEventListener('click', this.down.bind(this));
        this.parent.querySelectorAll(".scomponent-options>div.option").forEach((pOption)=>{
            pOption.addEventListener('click', this.toggleOptionSelectionHandler.bind(this), false);
            pOption.addEventListener('dblclick', this.automaticSwitchHandler.bind(this), true);
        });
    }

    automaticSwitchHandler(e){
        e.currentTarget.classList.add("selected");
        let from = e.currentTarget.parentNode.classList.contains('selected')?'selected':'available';
        let to = from==='selected'?'available':'selected';
        this._switch(e, from, to);
    }

    _switch(e, pFrom, pTo) {
        e.preventDefault();
        this.parent.querySelectorAll(".scomponent-options." + pFrom + " .option.selected").forEach((pItem)=>{
            pItem.parentNode.removeChild(pItem);
            this.parent.querySelector(".scomponent-options." + pTo).insertBefore(pItem, this.parent.querySelector(".scomponent-options." + pTo).lastChild);
            pItem.classList.remove("selected");
        });
        this.parent.querySelectorAll(".scomponent-options.selected .option").forEach((pItem)=>{
            document.querySelector('#' + pItem.dataset.id).selected = true;
        });
        this.parent.querySelectorAll(".scomponent-options.available .option").forEach((pItem)=>{
            document.querySelector('#' + pItem.dataset.id).selected = false;
        });
        this._reorder(e, 0);
        this._handleAvailableActions();
    }

    select(e) {
        this._switch(e, "available", "selected");
    }

    unselect(e) {
        this._switch(e, "selected", "available");
    }

    _reorder(e, pDirection) {
        e.preventDefault();
        let options = this.parent.querySelectorAll(".scomponent-options.selected .option");
        let option, ref_option, parent, i;
        if (pDirection !== 0) {
            i = pDirection === -1 ? 1 : options.length - 2;
            var inc = -pDirection;
            for (; pDirection === -1 ? i < options.length : i >= 0; i += inc) {
                options = this.parent.querySelectorAll(".scomponent-options.selected .option");
                option = options.item(i);
                ref_option = options.item(i + pDirection);
                if (option.classList.contains("selected") && !ref_option.classList.contains("selected")) {
                    parent = option.parentNode;
                    parent.removeChild(option);
                    parent.insertBefore(option, pDirection === -1 ? ref_option : ref_option.nextSibling);
                }
            }
            options = this.parent.querySelectorAll(".scomponent-options.selected .option");
        }
        let id, opt;
        for (i = options.length - 1; i >= 0; i--) {
            option = options.item(i);
            id = option.dataset.id;
            opt = document.getElementById(id);
            parent = opt.parentNode;
            parent.removeChild(opt);
            if (parent.firstChild) {
                parent.insertBefore(opt, parent.firstChild);
            } else {
                parent.appendChild(opt);
            }
        }
    }

    up(e) {
        this._reorder(e, -1);
    }

    down(e) {
        this._reorder(e, 1);
    }

    toggleOptionSelectionHandler(e) {
        if (!e.shiftKey) {
            Array.from(e.target.parentNode.querySelectorAll(".option")).forEach((pElement)=>{
                if(pElement === e.currentTarget){
                    return;
                }
                pElement.classList.remove("selected");
            });
        }
        e.target.classList.toggle("selected");
        this._handleAvailableActions();
    }

    _handleAvailableActions(){
        let orderingAction = document.querySelector('.scomponent-actions.ordering');
        orderingAction.classList.remove('selected');
        let selectionAction = document.querySelector('.scomponent-actions.selection');
        selectionAction.classList.remove('available', 'selected');
        if(document.querySelector('.scomponent-options.available .selected')){
            selectionAction.classList.add('available');
        }
        if(document.querySelector('.scomponent-options.selected .selected')){
            selectionAction.classList.add('selected');
            orderingAction.classList.add('selected');
        }
    }
}

(function () {
    function init() {
        document.querySelectorAll('select[rel="SelectComponent"]').forEach((pElement)=>{
            new SelectComponent(pElement);
        });
    }

    window.addEventListener("DOMContentLoaded", init, false);
})();