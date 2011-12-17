// using jQuery for convenience but any other JS library or plain onload function would also be fine
$(function() {
    // create viewModel instance
    var viewModel = new site.models.Gallery();
    var controller = $('div.controller');

    // fill in undefined functions with framework-specific methods
    viewModel.getSelectedIndex = function(el) {
        return $(el).closest('li').index();
    }
    // utility function to measure content area using framework-specific methods
    viewModel.measureContent = function() {
        var val = controller.find('li').width();
        return val * controller.find('li').length;
    }

    // initialise with a set of DOM elements
    viewModel.init($('ul.first a'));

    // bind to DOM
    ko.applyBindings(viewModel,$('body').get(0));

    // set viewmodel parameters measured from DOM
    // call after binding for accurate measurement
    viewModel.scrollable.scrollThreshold(controller.width());
    viewModel.scrollable.contentSize(viewModel.measureContent());
});