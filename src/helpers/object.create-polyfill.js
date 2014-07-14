if (typeof Object.create != 'function') {
    (function () {
        var F = function () {};
        Object.create = function (o,descriptor) {

            if (o === null) { 
              throw Error('Cannot set a null [[Prototype]]');
            }
            if (typeof o != 'object') { 
              throw TypeError('Argument must be an object');
            }
            F.prototype = o;
            var f = new F();

            //I added the following code to support property descriptors with a value property
            var property

            if (descriptor){
                for (property in descriptor) {
                    f[property] = descriptor[property].value
                }
            }

            return f

        };
    })();
}
