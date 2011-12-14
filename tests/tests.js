module("Main Model", {
    setup: function() {
    }
});

test("When creating a new empty Gallery viewmodel", function() {
    var Gallery = new site.models.Gallery();
    var scrollable = Gallery.scrollable;

    equal(Gallery.itemsObservables().length, 0, "there should be no values in itemsObservables");

});

module("Scrollable Area View Model", {
    setup: function () {
    }
});

test("When initialising scrollableArea UI scrolling values", function() {
    var scrollableArea = new site.models.ScrollableArea(true);
    scrollableArea.measureContent = function () { return 0; };

    equal(scrollableArea.isScrollable(), false, " scrollableArea isScrollable should initially be false");
    equal(scrollableArea.canScrollLeft(), false, " scrollableArea canScrollLeft should initially be false");
    equal(scrollableArea.canScrollRight(), false, " scrollableArea canScrollRight should initially be false");
    equal(scrollableArea.scrollInitTo(), "left", " scrollableArea scrollInit should initially be 'left'");
    equal(scrollableArea.scrollThreshold(), 0, " scrollableArea scrollThreshold should initially be 0");
    equal(scrollableArea.scrollOffset(), 0, " scrollableArea scrollOffset should initially be 0");
    equal(scrollableArea.scrollValue(), 0, " scrollableArea scrollValue should initially be 0");
    equal(scrollableArea.calculatedScrollValue(), 0, " scrollableArea calculatedScrollValue should initially be 0");
    equal(scrollableArea.contentSize(), 0, " scrollableArea contentSize should initially be 0");
});

test("When changing the size of the content when scrollInitTo is 'left' (default)", function () {
    var scrollableArea = new site.models.ScrollableArea(true);
    scrollableArea.measureContent = function () { return 0; };

    scrollableArea.scrollThreshold(980);
    scrollableArea.contentSize(400);

    equal(scrollableArea.scrollThreshold(), 980, " scrollableArea scrollThreshold should be initially be 980");
    equal(scrollableArea.contentSize(), 400, " scrollableArea contentSize should initially be 400");
    equal(scrollableArea.isScrollable(), false, " scrollableArea isScrollable should be set to false");
    equal(scrollableArea.scrollValue(), 0, " scrollableArea scrollValue should be set to 0");
    equal(scrollableArea.calculatedScrollValue(), 0, " scrollableArea calculatedScrollValue should be set to 0");

    scrollableArea.contentSize(1000);

    equal(scrollableArea.contentSize(), 1000, " scrollableArea contentSize should be updated to 1000");
    equal(scrollableArea.isScrollable(), true, " scrollableArea isScrollable should be set to true");
    equal(scrollableArea.canScrollLeft(), false, " scrollableArea canScrollLeft should be set to false");
    equal(scrollableArea.canScrollRight(), true, " scrollableArea canScrollRight should be set to true");
    equal(scrollableArea.scrollOffset(), 0, " scrollableArea scrollOffset should be set to 0");
    equal(scrollableArea.scrollValue(), 0, " scrollableArea scrollValue should be set to 0");
    equal(scrollableArea.calculatedScrollValue(), 0, " scrollableArea calculatedScrollValue should be set to 0");

    scrollableArea.contentSize(900);

    equal(scrollableArea.contentSize(), 900, " scrollableArea contentSize should be updated to 900");
    equal(scrollableArea.isScrollable(), false, " scrollableArea isScrollable should be set to false");
    equal(scrollableArea.canScrollLeft(), false, " scrollableArea canScrollLeft should be set to false");
    equal(scrollableArea.canScrollRight(), false, " scrollableArea canScrollRight should be set to false");
    equal(scrollableArea.scrollValue(), 0, " scrollableArea scrollValue should be set to 0");
    equal(scrollableArea.calculatedScrollValue(), 0, " scrollableArea calculatedScrollValue should be set to 0");
});

test("When changing the size of the content when scrollInitTo is 'right'", function () {
    var scrollableArea = new site.models.ScrollableArea(true);
    scrollableArea.measureContent = function () { return 0; };

    scrollableArea.scrollInitTo('right');
    scrollableArea.scrollThreshold(980);
    scrollableArea.contentSize(1000);

    equal(scrollableArea.contentSize(), 1000, " scrollableArea contentSize should be updated to 1000");
    equal(scrollableArea.isScrollable(), true, " scrollableArea isScrollable should be set to true");
    equal(scrollableArea.canScrollLeft(), true, " scrollableArea canScrollLeft should be set to true");
    equal(scrollableArea.canScrollRight(), false, " scrollableArea canScrollRight should be set to false");
    equal(scrollableArea.scrollOffset(), 0, " scrollableArea scrollOffset should be set to 0");
    equal(scrollableArea.scrollValue(), -20, " scrollableArea scrollValue should be set to -20");
    equal(scrollableArea.calculatedScrollValue(), -20, " scrollableArea calculatedScrollValue should be set to -20");
});

test("When changing the size of the scroll offset", function () {
    var scrollableArea = new site.models.ScrollableArea(true);
    scrollableArea.measureContent = function () { return 0; };

    scrollableArea.scrollThreshold(980);
    scrollableArea.contentSize(1000);
    scrollableArea.scrollOffset(20);
    scrollableArea.scrollInitTo('right');

    equal(scrollableArea.scrollOffset(), 20, " scrollableArea scrollOffset should be 20");
    equal(scrollableArea.canScrollLeft(), true, " scrollableArea canScrollLeft should be set to true");
    equal(scrollableArea.canScrollRight(), false, " scrollableArea canScrollRight should be set to false");
    equal(scrollableArea.scrollValue(), -20, " scrollableArea scrollValue should be set to -40");
    equal(scrollableArea.calculatedScrollValue(), -40, " scrollableArea calculatedScrollValue should be set to -40");
});

test("When writing to the calculated scroll value", function () {
    var scrollableArea = new site.models.ScrollableArea(true);
    scrollableArea.measureContent = function () { return 0; };

    scrollableArea.scrollThreshold(980);
    scrollableArea.contentSize(1000);
    scrollableArea.scrollOffset(20);
    scrollableArea.calculatedScrollValue(-100);

    equal(scrollableArea.scrollOffset(), 20, " scrollableArea scrollOffset should be 20");
    equal(scrollableArea.calculatedScrollValue(), -100, " scrollableArea calculatedScrollValue should be set to -100");
    equal(scrollableArea.scrollValue(), -80, " scrollableArea calculatedScrollValue should be set to -80");
});