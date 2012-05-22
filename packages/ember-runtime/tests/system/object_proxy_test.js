module("Ember.ObjectProxy");

testBoth("should proxy properties to content", function(get, set) {
  var content = {firstName: 'Tom', lastName: 'Dale'},
      proxy = Ember.ObjectProxy.create();

  equal(get(proxy, 'firstName'), undefined);
  set(proxy, 'firstName', 'Foo');
  equal(get(proxy, 'firstName'), undefined);

  set(proxy, 'content', content);

  equal(get(proxy, 'firstName'), 'Tom');
  equal(get(proxy, 'lastName'), 'Dale');
  equal(get(proxy, 'foo'), undefined);

  set(proxy, 'lastName', 'Huda');

  equal(get(content, 'lastName'), 'Huda');
  equal(get(proxy, 'lastName'), 'Huda');

  set(proxy, 'content', {firstName: 'Yehuda', lastName: 'Katz'});

  equal(get(proxy, 'firstName'), 'Yehuda');
  equal(get(proxy, 'lastName'), 'Katz');
});

testBoth("should work with watched properties", function(get, set) {
  var content = {firstName: 'Tom', lastName: 'Dale'}, proxy, last;

  Ember.run(function () {
    proxy = Ember.ObjectProxy.create({
      fullName: Ember.computed(function () {
        var firstName = this.get('firstName'),
            lastName = this.get('lastName');
        if (firstName && lastName) {
          return firstName + ' ' + lastName;
        }
        return firstName || lastName;
      }).property('firstName', 'lastName')
    });
  });

  Ember.addObserver(proxy, 'fullName', function () {
    last = get(proxy, 'fullName');
  });

  equal(get(proxy, 'fullName'), undefined);

  Ember.run(function () {
    set(proxy, 'content', content);
  });

  equal(last, 'Tom Dale');

  Ember.run(function () {
    set(content, 'lastName', 'Huda');
  });

  equal(last, 'Tom Huda');

  Ember.run(function () {
    set(proxy, 'content', {firstName: 'Yehuda', lastName: 'Katz'});
  });

  equal(last, 'Yehuda Katz');
});
