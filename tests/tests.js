module("Main Model", {
    setup: function() {
        this.testDOM = $('#qunit-fixture ul.origin');
    }
});

test("When creating a new empty Gallery viewmodel", function() {
    var Gallery = new site.models.Gallery();
    var scrollable = Gallery.scrollable;

    equal(Gallery.itemsObservables().length, 0, "there should be no values in itemsObservables");
});

test("When initialising content in Gallery viewmodel", function() {
    var Gallery = new site.models.Gallery();
    var scrollable = Gallery.scrollable;

    Gallery.init(this.testDOM.find('li a'));

    var Items = Gallery.itemsObservables();

    equal(Items.length, 8, "there should be 8 values in itemsObservables");

    var src = Items[0].src.split('/')[Items[0].src.split('/').length -1];

    equal(Items[0].isSelected(),true,"the first item in the itemsObservables should be selected");
    equal(src,'1.jpg',"the first item in the itemsObservables should have the correct src");
    equal(Items[0].caption,'Image 1 Caption',"the first item in the itemsObservables should have the correct caption");

    equal(Items[1].isSelected(),false,"the second item in the itemsObservables should not be selected");

    Gallery.setSelected(Items[1]);

    equal(Items[0].isSelected(),false,"the first item in the itemsObservables should not be selected");
    equal(Items[1].isSelected(),true,"the second item in the itemsObservables should be selected");

});