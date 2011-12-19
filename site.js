// using jQuery for convenience but any other JS library or plain onload function would also be fine
$(function() {
    // create viewModel instance
    var viewModel = new site.models.Gallery();

    // initialise with a set of DOM elements
    viewModel.init($('ul.origin a'));

    // bind to DOM
    ko.applyBindings(viewModel,$('body').get(0));
});