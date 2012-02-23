// using jQuery for convenience but any other JS library or plain onload function would also be fine
$(function() {
    // create viewModel instance
    var viewModel = new site.models.Gallery();

    // initialise with a set of DOM elements
    viewModel.init($('ul.first a'));

    // bind to DOM
    ko.applyBindings(viewModel,$('body').get(0));

    var c = $('div.controller');

    // fill in undefined functions with framework-specific methods
    // utility function to measure content area using framework-specific methods
    viewModel.measureContent = function() {
        return c.find('li').width() * c.find('li').length;
    }

    // set viewmodel parameters measured from DOM
    // call after binding for accurate measurement
    viewModel.scrollable.contentSize(viewModel.measureContent());
    viewModel.scrollable.scrollThreshold(c.width());
});