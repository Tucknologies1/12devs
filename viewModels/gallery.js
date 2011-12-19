// create namespace
var site = site || { models: { } };

// define Gallery viewmodel
site.models.Gallery = function() {
    // create self reference for use inside functions
    var self = this;

    // observable array to hold our gallery items
    this.itemsObservables = ko.observableArray();

    // function placeholder to be filled in using framework of choice
    this.measureContent = null;

    // create instance of Scrollable viewmodel
    this.scrollable = new site.models.ScrollableArea();

    // init function for viewmodel which is passed the elements of the gallery image list
    // update argument should be set to true if adding further data after first init
    this.init = function(data,update) {

        // knockout utility function to loop through our data
        ko.utils.arrayForEach(data,function(item) {
            self.itemsObservables.push(new site.models.GalleryItem(item));
        });

        // only make a default selection on the first init, otherwise preserve whatever is selected
        if (!update) {
            this.setSelected(this.itemsObservables()[0]);
        }
    }

    // utility function to capture click on a controller item and select the relevant gallery image
    this.select = function(e) {
        // get selected item by calling dataFor with event target node
        var newSelection = ko.dataFor(e.target);

        // call independent setSelected method
        self.setSelected(newSelection);

        // cancel original event
        e.preventDefault();
    }

    this.setSelected = function(newSelection) {
        // loop through and set appropriate selection
        ko.utils.arrayForEach(self.itemsObservables(),function(item) {
            item.isSelected(item == newSelection);
        });
    }

    // handle demo of adding more items
    this.moreAdded = ko.observable(false);
    this.more = function(e) {
        self.init($('ul.second a'),true);
        self.moreAdded(true);
        if (self.measureContent) {
            self.scrollable.contentSize(self.measureContent());
        }
        e.preventDefault();
    }
}

// define GalleryItem viewmodel
site.models.GalleryItem = function(el) {
    this.isSelected = ko.observable(false);
    this.src = el.href;
    this.caption = el.innerHTML;
}