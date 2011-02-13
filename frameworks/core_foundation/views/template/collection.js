sc_require('views/template');

SC.TemplateCollectionView = SC.TemplateView.extend({
  tagName: 'ul',
  content: null,
  template: SC.Handlebars.compile(''),

  // In case a default content was set, trigger the child view creation
  // as soon as the empty layer was created
  didCreateLayer: function() {
    if(this.get('content')) {
      var indexSet = SC.IndexSet.create(0, this.get('length'));
      this.arrayContentDidChange(this.get('content'), null, '[]', indexSet);
    }
  },

  exampleViewClass: function() {
    var exampleView = this.get('exampleView');
    if(SC.typeOf(exampleView) === SC.T_STRING) {
      return SC.objectForPropertyPath(exampleView);
    } else {
      return exampleView;
    }
  }.property('exampleView').cacheable(),

  contentDidChange: function() {
    var content = this.get('content');
    content.addRangeObserver(null, this, this.arrayContentDidChange);
  }.observes('content'),

  arrayContentDidChange: function(array, objects, key, indexes) {
    var exampleViewClass = this.get('exampleViewClass');
    var self = this;

    indexes.forEachRange(function(start, length) {
      var object = array.objectAt(start);
      var itemView = self.createChildView(exampleViewClass.extend({
        content: object
      }));
      self.get('childViews').pushObject(itemView);

      itemView.createLayer().$().appendTo(self.$());
    });
  }
});

