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