// create namespace
var site = { models: { } };


// define Gallery viewmodel
site.models.Gallery = function() {
    // create self reference for use inside functions
    var self = this;

    this.itemsObservables = ko.observableArray();
}



// using jQuery for convenience but any other JS library or plain onload function would also be fine
$(function() {

    var viewModel = new site.models.Gallery();

});