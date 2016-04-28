function DataGrid(object) {
    this.data = object.data;
    this.rootElement = object.rootElement;
    this.columns = object.columns;
    this.pageSize = object.pageSize;
    this.onRender = object.onRender;
    this.init();
}

(function(win) {
    DataGrid.prototype.init = function(){
        var root = this.rootElement;
        this.sort(this.columns[0].dataName);
        var column = root.getElementsByClassName(this.columns[0].dataName);  
        for (var i = 0; i < column.length; i++) {
            column[i].className += " sorted-column";
        }       
    };
    
    DataGrid.prototype.sort = function(item) {
        this.data.sort(function(a,b) {
            if (a[item] == b[item]) {
                return 0;
            }
            return a[item] < b[item] ? -1 : 1;
        });
        this.drawTable(1);
    };
    
    DataGrid.prototype.reverse = function(){
        this.data.reverse();
        this.drawTable(1);
    };
    
    DataGrid.prototype.drawTable = function(currentPage) {
        this.destroy();
        if (typeof(this.onRender) !== 'undefined') {
            var that = this;
            this.onRender(that);
        }
        var root = this.rootElement;
        var table = document.createElement("table");
        var caption = document.createElement("caption");
        if (typeof(this.pageSize) !== "undefined" && this.data.length > this.pageSize) {
            var lastPage = Math.ceil(this.data.length / this.pageSize);

            
            var prev = document.createElement("button");
            prev.textContent = "< Previous ";
            prev.setAttribute("class", "prev");
            if (currentPage == 1) {
                prev.setAttribute("disabled", "disabled");
            } else {
                prev.removeAttribute("disabled");
            }
            prev.addEventListener("click", prevPage.bind(this), false);
            function prevPage() {
                this.drawTable(--currentPage);
            }
            
            var p = document.createElement("span");
            p.textContent = currentPage + " of " + lastPage;
            
            var next = document.createElement("button");
            next.textContent = " Next >";
            next.setAttribute("class", "next");
            if (currentPage == lastPage) {
                next.setAttribute("disabled", "disabled");
            } else {
                next.removeAttribute("disabled");
            }
            next.addEventListener("click", nextPage.bind(this), false);
            function nextPage() {
                this.drawTable(++currentPage);
            }
            caption.appendChild(prev);
            caption.appendChild(p);
            caption.appendChild(next);
            
            table.appendChild(caption);
        }
        
        var thead = document.createElement("thead");
        var tr = document.createElement("tr");
        for (var i = 0; i < this.columns.length; i++) {
            var currentColumn = this.columns[i];
            var th = document.createElement("th");
            th.textContent = currentColumn.name;
            th.setAttribute("align", currentColumn.align);
            th.setAttribute("width", currentColumn.width);
            th.setAttribute("title", "Sort by " + currentColumn.name);
            th.setAttribute("data-name", currentColumn.dataName);
            th.addEventListener("click", clickToSort.bind(this), false);
            function clickToSort() {
                var item = event.target.getAttribute("data-name");
                var sortedColumns = this.rootElement.getElementsByClassName(item);

                if (sortedColumns[0].className == item + " sorted-column") {
                    this.reverse();
                }
                else {
                    this.sort(item);
                }

                for (var i = 0; i < sortedColumns.length;i++) {
                    sortedColumns[i].className += " sorted-column";
                }
            }
            tr.appendChild(th);
        }
        thead.appendChild(tr);
        table.appendChild(thead);

        
        var tbody = document.createElement("tbody");
        var start = 0;
        var end = this.data.length;
        if (typeof(this.pageSize) !== "undefined") {
            start = (currentPage - 1) * this.pageSize;
            end = Math.min(currentPage * this.pageSize, this.data.length);
        }
        for (var i = start; i < end; i++) {
            var tr = document.createElement("tr");
            var currentData = this.data[i];
            
            for (var j = 0; j < this.columns.length; j++) {
                var td = document.createElement("td");
                var currentColumn = this.columns[j];
                var item = currentColumn.dataName;
                td.textContent = currentData[item];
                td.setAttribute("align", currentColumn.align);
                td.setAttribute("width", currentColumn.width);
                td.setAttribute("data-name", currentColumn.dataName);
                td.setAttribute("class", item);
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        if (typeof(root) !== "undefined") {
            root.appendChild(table);
        }
    };

    DataGrid.prototype.destroy = function(){
        var root = this.rootElement;
        if (typeof(root) !== "undefined") {
            root.innerHTML = "";
        } 
    };
})(window);;