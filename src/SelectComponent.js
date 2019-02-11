
function SelectComponent(pElement){
    this.element = pElement;
    this.element.setAttribute("multiple", "multiple");
    this.element.style.display = "none";
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

Class.define(SelectComponent, [], {
    build:function(){
        var ref = this;
        var availableOptions = "<div class='scomponent-options available'>" + (this.unselectedOptions.map(function(pOption){
                return "<div class='option' data-value='"+pOption.getAttribute("value")+"' data-id='"+pOption.getAttribute("id")+"'>"+pOption.innerHTML+"</div>";
            })).join("") + '<div></div></div>';
        var selectedOptions = "<div class='scomponent-options selected'>" + (this.selectedOptions.map(function(pOption){
                return "<div class='option' data-value='"+pOption.getAttribute("value")+"' data-id='"+pOption.getAttribute("id")+"'>"+pOption.innerHTML+"</div>";
            })).join("") + '<div></div></div>';
        this.parent.innerHTML += "<div class='scomponent-container'>" +
            availableOptions +
            "<div class='scomponent-actions'><button class='select'>&gt;</button><button class='unselect'>&lt;</button></div>" +
            selectedOptions +
            "<div class='scomponent-actions'><button class='up'>&and;</button><button class='down'>&or;</button></div>" +
            "</div>";
        this.parent.querySelector("button.select").addEventListener('click', this.select.bind(this));
        this.parent.querySelector("button.unselect").addEventListener('click', this.unselect.bind(this));
        this.parent.querySelector("button.up").addEventListener('click', this.up.bind(this));
        this.parent.querySelector("button.down").addEventListener('click', this.down.bind(this));
        this.parent.querySelectorAll(".scomponent-options>div.option").forEach(function(pOption){
            pOption.addEventListener('click', ref.toggleOptionSelectionHandler.bind(ref), false);
        });
    },
    _switch:function(e, pFrom, pTo){
        e.preventDefault();
        var ref = this;
        this.parent.querySelectorAll(".scomponent-options."+pFrom+" .option.selected").forEach(function(pItem){
            pItem.parentNode.removeChild(pItem);
            ref.parent.querySelector(".scomponent-options."+pTo).insertBefore(pItem, ref.parent.querySelector(".scomponent-options."+pTo).lastChild);
            pItem.classList.remove("selected");
        });
        this.parent.querySelectorAll(".scomponent-options.selected .option").forEach(function(pItem){
            document.querySelector('#'+pItem.dataset.id).selected = true;
        });
        this.parent.querySelectorAll(".scomponent-options.available .option").forEach(function(pItem){
            document.querySelector('#'+pItem.dataset.id).selected = false;
        });
        this._reorder(e, 0);
    },
    select:function(e){
        this._switch(e, "available", "selected");
    },
    unselect:function(e){
        this._switch(e, "selected", "available");
    },
    _reorder:function(e, pDirection){
        e.preventDefault();
        var options = this.parent.querySelectorAll(".scomponent-options.selected .option");
        var option, ref_option, parent,i ;
        if(pDirection !== 0){
            i = pDirection === -1 ? 1 : options.length-2;
            var inc = -pDirection;
            for(;pDirection === -1 ? i<options.length : i>= 0; i += inc){
                options = this.parent.querySelectorAll(".scomponent-options.selected .option");
                option = options.item(i);
                ref_option = options.item(i + pDirection);
                if(option.classList.contains("selected")&&!ref_option.classList.contains("selected")){
                    parent = option.parentNode;
                    parent.removeChild(option);
                    parent.insertBefore(option, pDirection===-1?ref_option:ref_option.nextSibling);
                }
            }
            options = this.parent.querySelectorAll(".scomponent-options.selected .option");
        }
        var id, opt;
        for(i = options.length-1; i>=0; i--){
            option = options.item(i);
            id = option.dataset.id;
            opt = document.getElementById(id);
            parent = opt.parentNode;
            parent.removeChild(opt);
            if(parent.firstChild){
                parent.insertBefore(opt, parent.firstChild);
            }else{
                parent.appendChild(opt);
            }
        }
    },
    up:function(e){
        this._reorder(e, -1);
    },
    down:function(e){
        this._reorder(e, 1);
    },
    toggleOptionSelectionHandler:function(e){
        if(!e.ctrlKey){
            Array.from(e.target.parentNode.querySelectorAll(".option")).forEach(function(pElement){pElement.classList.remove("selected");});
        }
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