
function SelectComponent(pElement, pOptions){
    this.element = pElement;
    this.element.setAttribute("multiple", "multiple");
    this.parent = this.element.parentNode;
    this.options = this.element.querySelectorAll("option");
    var ct = 1;
    this.selectedOptions = Array.from(this.options).filter(function(pOption){
        pOption.setAttribute("id", pElement.getAttribute("id")+"_"+ct);
        ct++;
        return pOption.hasAttribute("selected");
    });
    this.unselectedOptions = Array.from(this.options).filter(function(pOption){
        return !pOption.hasAttribute("selected");
    });
    this.build();
}

Class.define(SelectComponent, [EventDispatcher], {
    build:function(){
        var ref = this;
        var availableOptions = "<div class='scomponent-options available'>" + (this.unselectedOptions.map(function(pOption){
                return "<div class='option' data-value='"+pOption.getAttribute("value")+"' data-id='"+pOption.getAttribute("id")+"'>"+pOption.innerHTML+"</div>";
            })).join("") + '</div>';
        var selectedOptions = "<div class='scomponent-options selected'>" + (this.selectedOptions.map(function(pOption){
                return "<div class='option' data-value='"+pOption.getAttribute("value")+"' data-id='"+pOption.getAttribute("id")+"'>"+pOption.innerHTML+"</div>";
            })).join("") + '</div>';
        this.parent.innerHTML += "<div class='scomponent-container'>" +
            availableOptions +
            "<div class='scomponent-actions'><button class='select'>&gt;</button><button class='unselect'>&lt;</button></div>" +
            selectedOptions +
            "</div>";
        this.parent.querySelector("button.select").addEventListener('click', this.select.bind(this));
        this.parent.querySelector("button.unselect").addEventListener('click', this.unselect.bind(this));
        this.parent.querySelectorAll(".scomponent-options>div.option").forEach(function(pOption){
            pOption.addEventListener('click', ref.toggleOptionSelectionHandler.bind(ref), false);
        });
    },
    _switch:function(e, pFrom, pTo){
        e.preventDefault();
        var ref = this;
        this.parent.querySelectorAll(".scomponent-options."+pFrom+" .option.selected").forEach(function(pItem){
            pItem.parentNode.removeChild(pItem);
            ref.parent.querySelector(".scomponent-options."+pTo).appendChild(pItem);
            pItem.classList.remove("selected");
        });
        this.parent.querySelectorAll(".scomponent-options.selected .option").forEach(function(pItem){
            document.querySelector('#'+pItem.dataset.id).selected = true;
        });
        this.parent.querySelectorAll(".scomponent-options.available .option").forEach(function(pItem){
            document.querySelector('#'+pItem.dataset.id).selected = false;
        });
    },
    select:function(e){
        this._switch(e, "available", "selected");
    },
    unselect:function(e){
        this._switch(e, "selected", "available");
    },
    toggleOptionSelectionHandler:function(e){
        e.target.classList.toggle("selected");
    }
});

(function(){
    function init(){
        document.querySelectorAll('select[rel="SelectComponent"]').forEach(function(pElement){
            new SelectComponent(pElement);
        });
    }
    window.addEventListener("DOMContentLoaded", init, false);
})();