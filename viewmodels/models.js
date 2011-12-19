// create namespace
var site = site || { models: { } };

// define Gallery viewmodel
site.models.Gallery = function() {
    // create self reference for use inside functions
    var self = this;

    this.itemsObservables = ko.observableArray();
    this.selectedItem = ko.observable();

    // create a subscriber to selectedItem to update into the child models
    this.selectedItem.subscribe(function(value) {
        if (value == undefined) return;

        // deselect everything
        ko.utils.arrayForEach(self.itemsObservables(),function(item) {
            item.isSelected(false);
        });

        // set new selection to isSelected
        self.itemsObservables()[value].isSelected(true);

    });

    // function placeholders to be filled in using framework of choice
    this.getSelectedIndex = null;
    this.measureContent = null;

    // create instance of Scrollable viewmodel
    this.scrollable = new site.models.ScrollableArea();

    // init function for viewmodel which is passed the elements of the gallery image list
    this.init = function(data) {

        // knockout utility function to loop through our data
        ko.utils.arrayForEach(data,function(item) {
            self.itemsObservables.push(new site.models.GalleryItem(item));
        });

        if (this.selectedItem() == undefined) {
            this.selectedItem(0);
        }
    }

    // utility function to capture click on a controller item and select the relevant gallery image
    this.select = function(e) {
        var index = self.getSelectedIndex(e.target);
        self.selectedItem(index);

        e.preventDefault();
    }

    // handle demo of adding more items
    this.moreAdded = ko.observable(false);
    this.more = function(e) {
        self.init($('ul.second a'));
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
    this.src = ko.observable(el.href);
    this.caption = ko.observable(el.innerHTML);
}

// define Scrollable viewmodel
site.models.ScrollableArea = function() {
    // create self reference for use inside functions
    var self = this;

    this.scrollThreshold = ko.observable(0); // total width of content area
    this.contentSize = ko.observable(0); // measured width of all content items

    this.scrollOffset = ko.observable(0); // left/right padding to avoid going under buttons
    this.scrollOffsetPadding = ko.observable(0); // extra padding for visual separation of buttons and selected content item

    this.scrollValue = ko.observable(0); // where the content should be scrolled to
    this.scrollInitTo = ko.observable('left'); // should the content scroll to left or right when it becomes scrollable

    this.scrollClickStep = ko.observable(400);

    this.isScrollable = ko.dependentObservable({
        read: function () {
            if (self.contentSize() > self.scrollThreshold()) {
                self.scrollValue((self.scrollInitTo() == 'right') ? self.scrollThreshold() - self.contentSize() : 0);
                return true;
            } else {
                self.scrollValue(0);
                return false;
            }
        }
    });
    this.calculatedScrollValue = ko.dependentObservable({
        read: function () {
            var newCalculatedScrollValue = self.scrollValue() - (self.scrollOffset() + self.scrollOffsetPadding());
            return (self.isScrollable()) ? newCalculatedScrollValue : 0;
        },
        write: function (value) {
            var newScrollValue = value + self.scrollOffset() + self.scrollOffsetPadding();
            self.scrollValue(newScrollValue);
        }
    });
    this.canScrollLeft = ko.dependentObservable({
        read: function () {
            return (self.isScrollable()) ? (self.calculatedScrollValue() != self.scrollOffset()) : false;
        }
    });
    this.canScrollRight = ko.dependentObservable({
        read: function () {
            var offset = self.scrollThreshold() - self.contentSize();
            return (self.isScrollable()) ? (self.scrollValue() != offset) : false;
        }
    });

    this.scrollContent = function (e) {

        var direction = e.target.getAttribute('data-direction');
        var newCalculatedScrollValue;

        if (direction == 'left') {
            newCalculatedScrollValue = self.calculatedScrollValue() + self.scrollClickStep();
            if (newCalculatedScrollValue > self.scrollOffset()) {
                newCalculatedScrollValue = self.scrollOffset();
            }
        } else if (direction == 'right') {
            newCalculatedScrollValue = self.calculatedScrollValue() - self.scrollClickStep();
            var limit = self.scrollThreshold() - (self.contentSize() + self.scrollOffset() + self.scrollOffsetPadding());

            if (newCalculatedScrollValue < limit) {
                newCalculatedScrollValue = limit;
            }
        } else {
            newCalculatedScrollValue = self.calculatedScrollValue();
        }

        self.calculatedScrollValue(newCalculatedScrollValue);

        e.preventDefault();
    };
}