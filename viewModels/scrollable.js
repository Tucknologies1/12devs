var site = site || { models: { } };

// define Scrollable viewmodel
site.models.ScrollableArea = function() {
    // create self reference for use inside functions
    var self = this;

    this.scrollThreshold = ko.observable(0); // total width of content area
    this.contentSize = ko.observable(0); // measured width of all content items
    this.scrollValue = ko.observable(0); // where the content should be scrolled to
    this.scrollClickStep = ko.observable(400);

    this.isScrollable = ko.computed(function () {
        return self.contentSize() > self.scrollThreshold();
    });
    this.calculatedScrollValue = ko.computed({
        read: function () {
            return (self.isScrollable()) ? self.scrollValue() : 0;
        },
        write: function (value) {
            self.scrollValue(value);
        }
    });
    this.canScrollLeft = ko.computed(function () {
        return (self.isScrollable()) ? (self.calculatedScrollValue() != 0) : false;
    });
    this.canScrollRight = ko.computed(function () {
        var offset = self.scrollThreshold() - self.contentSize();
        return (self.isScrollable()) ? (self.scrollValue() != offset) : false;
    });

    this.scrollContent = function (data,e) {
        var direction = e.target.getAttribute('data-direction');
        var newCalculatedScrollValue;

        if (direction == 'left') {
            newCalculatedScrollValue = self.calculatedScrollValue() + self.scrollClickStep();
        } else if (direction == 'right') {
            newCalculatedScrollValue = self.calculatedScrollValue() - self.scrollClickStep();
        } else {
            newCalculatedScrollValue = self.calculatedScrollValue();
        }

        self.calculatedScrollValue(newCalculatedScrollValue);
        e.preventDefault();
    };
}