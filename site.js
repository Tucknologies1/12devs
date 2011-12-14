// create namespace
var site = { models: { } };

// define Gallery viewmodel
site.models.Gallery = function() {
    // create self reference for use inside functions
    var self = this;

    this.itemsObservables = ko.observableArray();
    this.selectedItem = ko.observable();

    // create a subscribe to selectedItem to update into the child models
    this.selectedItem.subscribe(function(value) {
        if (value == undefined) return;

        // deselect everything
        ko.utils.arrayForEach(self.itemsObservables(),function(item) {
            item.isSelected(false);
        });

        // set new selection to isSelected
        self.itemsObservables()[value].isSelected(true);

        self.selectGalleryItem(value);
    });

    // create instance of Scrollable viewmodel
    this.scrollable = new site.models.ScrollableArea();

    // init function for viewmodel which is passed the elements of the gallery image list
    this.init = function(data) {

        ko.utils.arrayForEach(data,function(item) {
            self.itemsObservables.push(new site.models.GalleryItem(item));
        });

        this.selectedItem(0);
    }

    // utility function to capture click on a controller item and select the relevant gallery image
    this.select = function(e) {
        var index = self.getSelectedIndex(e.target);
        self.selectedItem(index);

        e.preventDefault();
    }

    // function placeholders to be filled in using framework of choice
    this.getSelectedIndex = null;
    this.selectGalleryItem = null;
}

// define GalleryItem viewmodel
site.models.GalleryItem = function(el) {
    this.isSelected = ko.observable(false);
    this.src = ko.observable(el.src);
    this.caption = ko.observable(el.alt);
}

// define Scrollable viewmodel
site.models.ScrollableArea = function() {
    // create self reference for use inside functions
    var self = this;

    this.scrollThreshold = ko.observable(0); // total width of content area
    this.scrollOffset = ko.observable(0); // left/right padding to avoid going under buttons
    this.scrollOffsetPadding = ko.observable(0); // extra padding for visual separation of buttons and selected content item
    this.contentSize = ko.observable(0); // measured width of all content items
    this.scrollValue = ko.observable(0); // where the content should be scrolled to
    this.scrollInitTo = ko.observable('left'); // should the content scroll to left or right when it becomes scrollable
    this.scrollClickStep = ko.observable(200);

    this.selectedOffLeft = ko.observable(false); // is selected item hidden to the left of the visible area
    this.selectedOffRight = ko.observable(false); // is selected item hidden to the right of the visible area

    this.measureContent = null;
    this.positionContent = null;
    this.recalculateScrollValue = null;

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
    this.calculatedScrollValue.subscribe(function (value) {
        if (self.positionContent) self.positionContent(value);
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

// using jQuery for convenience but any other JS library or plain onload function would also be fine
$(function() {

    // create viewModel instance
    var viewModel = new site.models.Gallery();
    var gallery = $('ul.gallery');
    var controller = $('div.controller');
    var selectedClass = 'selected';
    var measureContent = function() {
        var val = controller.find('li').width();

        return val * controller.find('li').length;
    }

    // fill in undefined functions with framework-specific methods
    viewModel.getSelectedIndex = function(el) {
        return $(el).closest('li').index();
    }
    viewModel.selectGalleryItem = function(index) {
        gallery.find('li.'+selectedClass).removeClass(selectedClass);
        gallery.find('li:eq('+index+')').addClass(selectedClass);
    }

    // initialise with a set of DOM elements
    viewModel.init($('ul.gallery li img'));

    // bind to DOM
    ko.applyBindings(viewModel,$('body').get(0));

    // set viewmodel parameters measured from DOM
    // call after binding for accurate measurement
    viewModel.scrollable.scrollThreshold(controller.width());
    viewModel.scrollable.contentSize(measureContent());

});