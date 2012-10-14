(function() {
  var bee, collision_response, flower, has_collided, helper, init_mouse, is_dragging, mouse, mouse_dx, update, world;

  helper = new CanvasHelper(document.getElementById('game'));

  world = new World();

  bee = new Bee(new SAT.Vector(264, helper.half_height));

  flower = new Flower({
    petal_width: 128,
    petal_height: 64,
    position: new SAT.Vector(helper.half_width, helper.height),
    stem_height: 240,
    angle: -25
  });

  collision_response = new SAT.Response();

  init_mouse = new SAT.Vector();

  mouse = new SAT.Vector();

  is_dragging = false;

  mouse_dx = null;

  $(helper.canvas).on('mousedown', function(e) {
    init_mouse.x = mouse.x = e.clientX;
    init_mouse.y = mouse.y = e.clientY;
    return is_dragging = bee.contains(mouse);
  });

  $(helper.canvas).on('mouseup', function(e) {
    if (is_dragging) {
      is_dragging = false;
      bee.is_flying = true;
      return bee.acceleration.sub(mouse_dx);
    }
  });

  $(helper.canvas).on('mousemove', function(e) {
    if (!is_dragging) {
      return;
    }
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    return mouse_dx = new SAT.Vector().copy(mouse).sub(init_mouse);
  });

  has_collided = false;

  update = function() {
    var offset;
    if (has_collided) {
      return;
    }
    has_collided = SAT.testPolygonPolygon(bee.bounding_box, flower.bounding_box, collision_response);
    if (has_collided) {
      bee.is_flying = false;
      offset = (new SAT.Vector()).copy(collision_response.overlapV).reverse();
      bee.position.add(offset);
      bee.velocity.add(offset);
      return console.warn(has_collided, collision_response);
    }
  };

  helper.render(function() {
    update();
    world.render(helper);
    flower.render(helper);
    return bee.render(helper);
  });

}).call(this);
