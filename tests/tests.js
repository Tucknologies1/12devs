module("Main Model", {
    setup: function() {
    }
});

test("When creating a new empty Gallery viewmodel", function() {
    var Gallery = new site.models.Gallery();

    equal(Gallery.itemsObservables().length, 0, "there should be no values in itemsObservables");
});