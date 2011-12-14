// create namespace
var site = { models: { } };


// define Gallery viewmodel
site.models.Gallery = function() {
    // create self reference for use inside functions
    var self = this;

    this.itemsObservables = ko.observableArray();

    // create instance of Scrollable viewmodel
    this.scrollable = new site.models.ScrollableArea();
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

    var viewModel = new site.models.Gallery();

});