import * as THREE from 'three';

const TERRAIN = {}
    /**
     * TERRAIN.Terrain.js 1.6.0-20180415
     *
     * @author Isaac Sukin (http://www.isaacsukin.com/)
     * @license MIT
     */

/**
 * A terrain object for use with the Three.js library.
 *
 * Usage: `var terrainScene = TERRAIN.Terrain();`
 *
 * @param {Object} [options]
 *   An optional map of settings that control how the terrain is constructed
 *   and displayed. Options include:
 *
 *   - `after`: A function to run after other transformations on the terrain
 *     produce the highest-detail heightmap, but before optimizations and
 *     visual properties are applied. Takes two parameters, which are the same
 *     as those for {@link TERRAIN.Terrain.DiamondSquare}: an array of
 *     `TERRAIN.Vector3` objects representing the vertices of the terrain, and a
 *     map of options with the same available properties as the `options`
 *     parameter for the `TERRAIN.Terrain` function.
 *   - `easing`: A function that affects the distribution of slopes by
 *     interpolating the height of each vertex along a curve. Valid values
 *     include `TERRAIN.Terrain.Linear` (the default), `TERRAIN.Terrain.EaseIn`,
 *     `TERRAIN.Terrain.EaseOut`, `TERRAIN.Terrain.EaseInOut`,
 *     `TERRAIN.Terrain.InEaseOut`, and any custom function that accepts a float
 *     between 0 and 1 and returns a float between 0 and 1.
 *   - `frequency`: For terrain generation methods that support it (Perlin,
 *     Simplex, and Worley) the octave of randomness. This basically controls
 *     how big features of the terrain will be (higher frequencies result in
 *     smaller features). Often running multiple generation functions with
 *     different frequencies and heights results in nice detail, as
 *     the PerlinLayers and SimplexLayers methods demonstrate. (The counterpart
 *     to frequency, amplitude, is represented by the difference between the
 *     `maxHeight` and `minHeight` parameters.) Defaults to 2.5.
 *   - `heightmap`: Either a canvas or pre-loaded image (from the same domain
 *     as the webpage or served with a CORS-friendly header) representing
 *     terrain height data (lighter pixels are higher); or a function used to
 *     generate random height data for the terrain. Valid random functions are
 *     specified in `generators.js` (or custom functions with the same
 *     signature). Ideally heightmap images have the same number of pixels as
 *     the terrain has vertices, as determined by the `xSegments` and
 *     `ySegments` options, but this is not required. If the heightmap is a
 *     different size, vertex height values will be interpolated.) Defaults to
 *     `TERRAIN.Terrain.DiamondSquare`.
 *   - `material`: a TERRAIN.Material instance used to display the terrain.
 *     Defaults to `new THREE.MeshBasicMaterial({color: 0xee6633})`.
 *   - `maxHeight`: the highest point, in Three.js units, that a peak should
 *     reach. Defaults to 100. Setting to `undefined`, `null`, or `Infinity`
 *     removes the cap, but this is generally not recommended because many
 *     generators and filters require a vertical range. Instead, consider
 *     setting the `stretch` option to `false`.
 *   - `minHeight`: the lowest point, in Three.js units, that a valley should
 *     reach. Defaults to -100. Setting to `undefined`, `null`, or `-Infinity`
 *     removes the cap, but this is generally not recommended because many
 *     generators and filters require a vertical range. Instead, consider
 *     setting the `stretch` option to `false`.
 *   - `steps`: If this is a number above 1, the terrain will be paritioned
 *     into that many flat "steps," resulting in a blocky appearance. Defaults
 *     to 1.
 *   - `stretch`: Determines whether to stretch the heightmap across the
 *     maximum and minimum height range if the height range produced by the
 *     `heightmap` property is smaller. Defaults to true.
 *   - `turbulent`: Whether to perform a turbulence transformation. Defaults to
 *     false.
 *   - `useBufferGeometry`: a Boolean indicating whether to use
 *     TERRAIN.BufferGeometry instead of TERRAIN.Geometry for the Terrain plane.
 *     Defaults to `false`.
 *   - `xSegments`: The number of segments (rows) to divide the terrain plane
 *     into. (This basically determines how detailed the terrain is.) Defaults
 *     to 63.
 *   - `xSize`: The width of the terrain in Three.js units. Defaults to 1024.
 *     Rendering might be slightly faster if this is a multiple of
 *     `options.xSegments + 1`.
 *   - `ySegments`: The number of segments (columns) to divide the terrain
 *     plane into. (This basically determines how detailed the terrain is.)
 *     Defaults to 63.
 *   - `ySize`: The length of the terrain in Three.js units. Defaults to 1024.
 *     Rendering might be slightly faster if this is a multiple of
 *     `options.ySegments + 1`.
 */
TERRAIN.Terrain = function(options) {
    var defaultOptions = {
        after: null,
        easing: TERRAIN.Terrain.Linear,
        heightmap: TERRAIN.Terrain.DiamondSquare,
        material: null,
        maxHeight: 100,
        minHeight: -100,
        optimization: TERRAIN.Terrain.NONE,
        frequency: 2.5,
        steps: 1,
        stretch: true,
        turbulent: false,
        useBufferGeometry: false,
        xSegments: 63,
        xSize: 1024,
        ySegments: 63,
        ySize: 1024,
        seed: .5,
        diamondSquare: [.3, .4],
        position: new THREE.Vector3(0, 0, 0),
        _mesh: null, // internal only
    };
    options = options || {};
    for (var opt in defaultOptions) {
        if (defaultOptions.hasOwnProperty(opt)) {
            options[opt] = typeof options[opt] === 'undefined' ? defaultOptions[opt] : options[opt];
        }
    }
    options.material = options.material || new THREE.MeshBasicMaterial({ color: 0xee6633 });

    // Encapsulating the terrain in a parent object allows us the flexibility
    // to more easily have multiple meshes for optimization purposes.
    var scene = new THREE.Object3D();
    // Planes are initialized on the XY plane, so rotate the plane to make it lie flat.
    scene.rotation.x = -0.5 * Math.PI;

    // Create the terrain mesh.
    // To save memory, it is possible to re-use a pre-existing mesh.
    var mesh = options._mesh;
    if (mesh && mesh.geometry.type === 'PlaneGeometry' &&
        mesh.geometry.parameters.widthSegments === options.xSegments &&
        mesh.geometry.parameters.heightSegments === options.ySegments) {
        mesh.material = options.material;
        mesh.scale.x = options.xSize / mesh.geometry.parameters.width;
        mesh.scale.y = options.ySize / mesh.geometry.parameters.height;
        for (var i = 0, l = mesh.geometry.vertices.length; i < l; i++) {
            mesh.geometry.vertices[i].z = 0;
        }
    } else {
        mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(options.xSize, options.ySize, options.xSegments, options.ySegments),
            options.material
        );
    }
    delete options._mesh; // Remove the reference for GC

    // Assign elevation data to the terrain plane from a heightmap or function.
    if (options.heightmap instanceof HTMLCanvasElement || options.heightmap instanceof Image) {
        TERRAIN.Terrain.fromHeightmap(mesh.geometry.vertices, options);
    } else if (typeof options.heightmap === 'function') {
        // console.log(mesh.geometry.attributes.position.array);
        // options.heightmap(mesh.geometry.vertices, options);
        options.heightmap(mesh.geometry.attributes.position.array, options);

    } else {
        console.warn('An invalid value was passed for `options.heightmap`: ' + options.heightmap);
    }
    TERRAIN.Terrain.Normalize(mesh, options);

    if (options.useBufferGeometry) {
        mesh.geometry = (new THREE.BufferGeometry()).fromGeometry(mesh.geometry);
    }

    // lod.addLevel(mesh, options.unit * 10 * Math.pow(2, lodLevel));

    scene.add(mesh);
    return scene;
};

/**
 * Normalize the terrain after applying a heightmap or filter.
 *
 * This applies turbulence, steps, and height clamping; calls the `after`
 * callback; updates normals and the bounding sphere; and marks vertices as
 * dirty.
 *
 * @param {TERRAIN.Mesh} mesh
 *   The terrain mesh.
 * @param {Object} options
 *   A map of settings that control how the terrain is constructed and
 *   displayed. Valid options are the same as for {@link TERRAIN.Terrain}().
 */
TERRAIN.Terrain.Normalize = function(mesh, options) {
    console.log('TERRAIN.Terrain.Normalize', 'no random');
    var v = mesh.geometry.vertices; //ald versions
    v = mesh.geometry.attributes.position.array
    if (options.turbulent) {
        TERRAIN.Terrain.Turbulence(v, options);
    }
    if (options.steps > 1) {
        TERRAIN.Terrain.Step(v, options.steps);
        TERRAIN.Terrain.Smooth(v, options);
    }
    // Keep the terrain within the allotted height range if necessary, and do easing.
    TERRAIN.Terrain.Clamp(v, options);
    // Call the "after" callback
    if (typeof options.after === 'function') {
        options.after(v, options);
    }
    // Mark the geometry as having changed and needing updates.
    mesh.geometry.verticesNeedUpdate = true;
    mesh.geometry.normalsNeedUpdate = true;
    mesh.geometry.attributes.position.needsUpdate = true;

    mesh.material.needsUpdate = true
    mesh.geometry.computeBoundingSphere();
    mesh.geometry.computeFaceNormals();
    mesh.geometry.computeVertexNormals();
};

/**
 * Optimization types.
 *
 * Note that none of these are implemented right now. They should be done as
 * shaders so that they execute on the GPU, and the resulting scene would need
 * to be updated every frame to adjust to the camera's position.
 *
 * Further reading:
 * - http://vterrain.org/LOD/Papers/
 * - http://vterrain.org/LOD/Implementations/
 *
 * GEOMIPMAP: The terrain plane should be split into sections, each with their
 * own LODs, for screen-space occlusion and detail reduction. Intermediate
 * vertices on higher-detail neighboring sections should be interpolated
 * between neighbor edge vertices in order to match with the edge of the
 * lower-detail section. The number of sections should be around sqrt(segments)
 * along each axis. It's unclear how to make materials stretch across segments.
 * Possible example (I haven't looked too much into it) at
 * https://github.com/felixpalmer/lod-terrain/tree/master/js/shaders
 *
 * GEOCLIPMAP: The terrain should be composed of multiple donut-shaped sections
 * at decreasing resolution as the radius gets bigger. When the player moves,
 * the sections should morph so that the detail "follows" the player around.
 * There is an implementation of geoclipmapping at
 * https://github.com/CodeArtemis/TriggerRally/blob/unified/server/public/scripts/client/terrain.coffee
 * and a tutorial on morph targets at
 * http://nikdudnik.com/making-3d-gfx-for-the-cinema-on-low-budget-and-three-js/
 *
 * POLYGONREDUCTION: Combine areas that are relatively coplanar into larger
 * polygons as described at http://www.shamusyoung.com/twentysidedtale/?p=142.
 * This method can be combined with the others if done very carefully, or it
 * can be adjusted to be more aggressive at greater distance from the camera
 * (similar to combining with geomipmapping).
 *
 * If these do get implemented, here is the option description to add to the
 * `TERRAIN.Terrain` docblock:
 *
 *    - `optimization`: the type of optimization to apply to the terrain. If
 *      an optimization is applied, the number of segments along each axis that
 *      the terrain should be divided into at the most detailed level should
 *      equal (n * 2^(LODs-1))^2 - 1, for arbitrary n, where LODs is the number
 *      of levels of detail desired. Valid values include:
 *
 *          - `TERRAIN.Terrain.NONE`: Don't apply any optimizations. This is the
 *            default.
 *          - `TERRAIN.Terrain.GEOMIPMAP`: Divide the terrain into evenly-sized
 *            sections with multiple levels of detail. For each section,
 *            display a level of detail dependent on how close the camera is.
 *          - `TERRAIN.Terrain.GEOCLIPMAP`: Divide the terrain into donut-shaped
 *            sections, where detail decreases as the radius increases. The
 *            rings then morph to "follow" the camera around so that the camera
 *            is always at the center, surrounded by the most detail.
 */
TERRAIN.Terrain.NONE = 0;
TERRAIN.Terrain.GEOMIPMAP = 1;
TERRAIN.Terrain.GEOCLIPMAP = 2;
TERRAIN.Terrain.POLYGONREDUCTION = 3;

/**
 * Get a 2D array of heightmap values from a 1D array of plane vertices.
 *
 * @param {TERRAIN.Vector3[]} vertices
 *   A 1D array containing the vertices of the plane geometry representing the
 *   terrain, where the z-value of the vertices represent the terrain's
 *   heightmap.
 * @param {Object} options
 *   A map of settings defining properties of the terrain. The only properties
 *   that matter here are `xSegments` and `ySegments`, which represent how many
 *   vertices wide and deep the terrain plane is, respectively (and therefore
 *   also the dimensions of the returned array).
 *
 * @return {Number[][]}
 *   A 2D array representing the terrain's heightmap.
 */
TERRAIN.Terrain.toArray2D = function(vertices, options) {
    console.log('TERRAIN.Terrain.toArray2D');
    var tgt = new Array(options.xSegments),
        xl = options.xSegments + 1,
        yl = options.ySegments + 1,
        i, j;
    for (i = 0; i < xl; i++) {
        tgt[i] = new Float64Array(options.ySegments);
        for (j = 0; j < yl; j++) {
            tgt[i][j] = vertices[j * xl + i].z;
        }
    }
    return tgt;
};

/**
 * Set the height of plane vertices from a 2D array of heightmap values.
 *
 * @param {TERRAIN.Vector3[]} vertices
 *   A 1D array containing the vertices of the plane geometry representing the
 *   terrain, where the z-value of the vertices represent the terrain's
 *   heightmap.
 * @param {Number[][]} src
 *   A 2D array representing a heightmap to apply to the terrain.
 */
TERRAIN.Terrain.fromArray2D = function(vertices, src) {
    console.log('TERRAIN.Terrain.fromArray2D');
    for (var i = 0, xl = src.length; i < xl; i++) {
        for (var j = 0, yl = src[i].length; j < yl; j++) {
            vertices[j * xl + i].z = src[i][j];
        }
    }
};

/**
 * Get a 1D array of heightmap values from a 1D array of plane vertices.
 *
 * @param {TERRAIN.Vector3[]} vertices
 *   A 1D array containing the vertices of the plane geometry representing the
 *   terrain, where the z-value of the vertices represent the terrain's
 *   heightmap.
 * @param {Object} options
 *   A map of settings defining properties of the terrain. The only properties
 *   that matter here are `xSegments` and `ySegments`, which represent how many
 *   vertices wide and deep the terrain plane is, respectively (and therefore
 *   also the dimensions of the returned array).
 *
 * @return {Number[]}
 *   A 1D array representing the terrain's heightmap.
 */
TERRAIN.Terrain.toArray1D = function(vertices) {
    console.log('TERRAIN.Terrain.toArray1D');
    var tgt = new Float64Array(vertices.length);
    for (var i = 0, l = tgt.length; i < l; i++) {
        tgt[i] = vertices[i].z;
    }
    return tgt;
};

/**
 * Set the height of plane vertices from a 1D array of heightmap values.
 *
 * @param {TERRAIN.Vector3[]} vertices
 *   A 1D array containing the vertices of the plane geometry representing the
 *   terrain, where the z-value of the vertices represent the terrain's
 *   heightmap.
 * @param {Number[]} src
 *   A 1D array representing a heightmap to apply to the terrain.
 */
TERRAIN.Terrain.fromArray1D = function(vertices, src) {
    console.log('TERRAIN.Terrain.fromArray1D');
    for (var i = 0, l = Math.min(vertices.length, src.length); i < l; i++) {
        vertices[i].z = src[i];
    }
};

/**
 * Generate a 1D array containing random heightmap data.
 *
 * This is like {@link TERRAIN.Terrain.toHeightmap} except that instead of
 * generating the Three.js mesh and material information you can just get the
 * height data.
 *
 * @param {Function} method
 *   The method to use to generate the heightmap data. Works with function that
 *   would be an acceptable value for the `heightmap` option for the
 *   {@link TERRAIN.Terrain} function.
 * @param {Number} options
 *   The same as the options parameter for the {@link TERRAIN.Terrain} function.
 */
TERRAIN.Terrain.heightmapArray = function(method, options) {
    console.log('TERRAIN.Terrain.heightmapArray');
    var arr = new Array((options.xSegments + 1) * (options.ySegments + 1)),
        l = arr.length,
        i;
    // The heightmap functions provided by this script operate on TERRAIN.Vector3
    // objects by changing the z field, so we need to make that available.
    // Unfortunately that means creating a bunch of objects we're just going to
    // throw away, but a conscious decision was made here to optimize for the
    // vector case.
    for (i = 0; i < l; i++) {
        arr[i] = { z: 0 };
    }
    options.minHeight = options.minHeight || 0;
    options.maxHeight = typeof options.maxHeight === 'undefined' ? 1 : options.maxHeight;
    options.stretch = options.stretch || false;
    method(arr, options);
    TERRAIN.Terrain.Clamp(arr, options);
    for (i = 0; i < l; i++) {
        arr[i] = arr[i].z;
    }
    return arr;
};

/**
 * Randomness interpolation functions.
 */
TERRAIN.Terrain.Linear = function(x) {
    return x;
};

// x = [0, 1], x^2
TERRAIN.Terrain.EaseIn = function(x) {
    return x * x;
};

// x = [0, 1], -x(x-2)
TERRAIN.Terrain.EaseOut = function(x) {
    return -x * (x - 2);
};

// x = [0, 1], x^2(3-2x)
// Nearly identical alternatives: 0.5+0.5*cos(x*pi-pi), x^a/(x^a+(1-x)^a) (where a=1.6 seems nice)
// For comparison: http://www.wolframalpha.com/input/?i=x^1.6%2F%28x^1.6%2B%281-x%29^1.6%29%2C+x^2%283-2x%29%2C+0.5%2B0.5*cos%28x*pi-pi%29+from+0+to+1
TERRAIN.Terrain.EaseInOut = function(x) {
    return x * x * (3 - 2 * x);
};

// x = [0, 1], 0.5*(2x-1)^3+0.5
TERRAIN.Terrain.InEaseOut = function(x) {
    var y = 2 * x - 1;
    return 0.5 * y * y * y + 0.5;
};

// x = [0, 1], x^1.55
TERRAIN.Terrain.EaseInWeak = function(x) {
    return Math.pow(x, 1.55);
};

// x = [0, 1], x^7
TERRAIN.Terrain.EaseInStrong = function(x) {
    return x * x * x * x * x * x * x;
};

/**
 * Convert an image-based heightmap into vertex-based height data.
 *
 * @param {TERRAIN.Vector3[]} g
 *   The vertex array for plane geometry to modify with heightmap data. This
 *   method sets the `z` property of each vertex.
 * @param {Object} options
 *   A map of settings that control how the terrain is constructed and
 *   displayed. Valid values are the same as those for the `options` parameter
 *   of {@link TERRAIN.Terrain}().
 */
TERRAIN.Terrain.fromHeightmap = function(g, options) {
    console.log('TERRAIN.Terrain.fromHeightmap');
    var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d'),
        rows = options.ySegments + 1,
        cols = options.xSegments + 1,
        spread = options.maxHeight - options.minHeight;
    canvas.width = cols;
    canvas.height = rows;
    context.drawImage(options.heightmap, 0, 0, canvas.width, canvas.height);
    var data = context.getImageData(0, 0, canvas.width, canvas.height).data;
    for (var row = 0; row < rows; row++) {
        for (var col = 0; col < cols; col++) {
            var i = row * cols + col,
                idx = i * 4;
            g[i].z = (data[idx] + data[idx + 1] + data[idx + 2]) / 765 * spread + options.minHeight;
        }
    }
};

/**
 * Convert a terrain plane into an image-based heightmap.
 *
 * Parameters are the same as for {@link TERRAIN.Terrain.fromHeightmap} except
 * that if `options.heightmap` is a canvas element then the image will be
 * painted onto that canvas; otherwise a new canvas will be created.
 *
 * NOTE: this method performs an operation on an array of vertices, which
 * aren't available when using `BufferGeometry`. So, if you want to use this
 * method, make sure to set the `useBufferGeometry` option to `false` when
 * generating your terrain.
 *
 * @return {HTMLCanvasElement}
 *   A canvas with the relevant heightmap painted on it.
 */
TERRAIN.Terrain.toHeightmap = function(g, options) {
    console.log('TERRAIN.Terrain.toHeightmap');
    var hasMax = typeof options.maxHeight === 'undefined',
        hasMin = typeof options.minHeight === 'undefined',
        max = hasMax ? options.maxHeight : -Infinity,
        min = hasMin ? options.minHeight : Infinity;
    if (!hasMax || !hasMin) {
        var max2 = max,
            min2 = min;
        for (var k = 0, l = g.length; k < l; k++) {
            if (g[k].z > max2) max2 = g[k].z;
            if (g[k].z < min2) min2 = g[k].z;
        }
        if (!hasMax) max = max2;
        if (!hasMin) min = min2;
    }
    var canvas = options.heightmap instanceof HTMLCanvasElement ? options.heightmap : document.createElement('canvas'),
        context = canvas.getContext('2d'),
        rows = options.ySegments + 1,
        cols = options.xSegments + 1,
        spread = options.maxHeight - options.minHeight;
    canvas.width = cols;
    canvas.height = rows;
    var d = context.createImageData(canvas.width, canvas.height),
        data = d.data;
    for (var row = 0; row < rows; row++) {
        for (var col = 0; col < cols; col++) {
            var i = row * cols + col,
                idx = i * 4;
            data[idx] = data[idx + 1] = data[idx + 2] = Math.round(((g[i].z - options.minHeight) / spread) * 255);
            data[idx + 3] = 255;
        }
    }
    context.putImageData(d, 0, 0);
    return canvas;
};

/**
 * Rescale the heightmap of a terrain to keep it within the maximum range.
 *
 * @param {TERRAIN.Vector3[]} g
 *   The vertex array for plane geometry to modify with heightmap data. This
 *   method sets the `z` property of each vertex.
 * @param {Object} options
 *   A map of settings that control how the terrain is constructed and
 *   displayed. Valid values are the same as those for the `options` parameter
 *   of {@link TERRAIN.Terrain}() but only `maxHeight`, `minHeight`, and `easing`
 *   are used.
 */
TERRAIN.Terrain.Clamp = function(g, options) {
    var min = Infinity,
        max = -Infinity,
        l = g.length,
        i;
    options.easing = options.easing || TERRAIN.Terrain.Linear;
    for (i = 0; i < l; i++) {
        if (g[i].z < min) min = g[i].z;
        if (g[i].z > max) max = g[i].z;
    }
    var actualRange = max - min,
        optMax = typeof options.maxHeight !== 'number' ? max : options.maxHeight,
        optMin = typeof options.minHeight !== 'number' ? min : options.minHeight,
        targetMax = options.stretch ? optMax : (max < optMax ? max : optMax),
        targetMin = options.stretch ? optMin : (min > optMin ? min : optMin),
        range = targetMax - targetMin;
    if (targetMax < targetMin) {
        targetMax = optMax;
        range = targetMax - targetMin;
    }
    for (i = 0; i < l; i++) {
        g[i].z = options.easing((g[i].z - min) / actualRange) * range + optMin;
    }
};

/**
 * Move the edges of the terrain up or down based on distance from the edge.
 *
 * Useful to make islands or enclosing walls/cliffs.
 *
 * @param {TERRAIN.Vector3[]} g
 *   The vertex array for plane geometry to modify with heightmap data. This
 *   method sets the `z` property of each vertex.
 * @param {Object} options
 *   A map of settings that control how the terrain is constructed and
 *   displayed. Valid values are the same as those for the `options` parameter
 *   of {@link TERRAIN.Terrain}().
 * @param {Boolean} direction
 *   `true` if the edges should be turned up; `false` if they should be turned
 *   down.
 * @param {Number} distance
 *   The distance from the edge at which the edges should begin to be affected
 *   by this operation.
 * @param {Number/Function} [e=TERRAIN.Terrain.EaseInOut]
 *   A function that determines how quickly the terrain will transition between
 *   its current height and the edge shape as distance to the edge decreases.
 *   It does this by interpolating the height of each vertex along a curve.
 *   Valid values include `TERRAIN.Terrain.Linear`, `TERRAIN.Terrain.EaseIn`,
 *   `TERRAIN.Terrain.EaseOut`, `TERRAIN.Terrain.EaseInOut`,
 *   `TERRAIN.Terrain.InEaseOut`, and any custom function that accepts a float
 *   between 0 and 1 and returns a float between 0 and 1.
 * @param {Object} [edges={top: true, bottom: true, left: true, right: true}]
 *   Determines which edges should be affected by this function. Defaults to
 *   all edges. If passed, should be an object with `top`, `bottom`, `left`,
 *   and `right` Boolean properties specifying which edges to affect.
 */
TERRAIN.Terrain.Edges = function(g, options, direction, distance, easing, edges) {
    console.log('TERRAIN.Terrain.Edges');
    var numXSegments = Math.floor(distance / (options.xSize / options.xSegments)) || 1,
        numYSegments = Math.floor(distance / (options.ySize / options.ySegments)) || 1,
        peak = direction ? options.maxHeight : options.minHeight,
        max = direction ? Math.max : Math.min,
        xl = options.xSegments + 1,
        yl = options.ySegments + 1,
        i, j, multiplier, k1, k2;
    easing = easing || TERRAIN.Terrain.EaseInOut;
    if (typeof edges !== 'object') {
        edges = { top: true, bottom: true, left: true, right: true };
    }
    for (i = 0; i < xl; i++) {
        for (j = 0; j < numYSegments; j++) {
            multiplier = easing(1 - j / numYSegments);
            k1 = j * xl + i;
            k2 = (options.ySegments - j) * xl + i;
            if (edges.top) {
                g[k1].z = max(g[k1].z, (peak - g[k1].z) * multiplier + g[k1].z);
            }
            if (edges.bottom) {
                g[k2].z = max(g[k2].z, (peak - g[k2].z) * multiplier + g[k2].z);
            }
        }
    }
    for (i = 0; i < yl; i++) {
        for (j = 0; j < numXSegments; j++) {
            multiplier = easing(1 - j / numXSegments);
            k1 = i * xl + j;
            k2 = (options.ySegments - i) * xl + (options.xSegments - j);
            if (edges.left) {
                g[k1].z = max(g[k1].z, (peak - g[k1].z) * multiplier + g[k1].z);
            }
            if (edges.right) {
                g[k2].z = max(g[k2].z, (peak - g[k2].z) * multiplier + g[k2].z);
            }
        }
    }
    TERRAIN.Terrain.Clamp(g, {
        maxHeight: options.maxHeight,
        minHeight: options.minHeight,
        stretch: true,
    });
};

/**
 * Move the edges of the terrain up or down based on distance from the center.
 *
 * Useful to make islands or enclosing walls/cliffs.
 *
 * @param {TERRAIN.Vector3[]} g
 *   The vertex array for plane geometry to modify with heightmap data. This
 *   method sets the `z` property of each vertex.
 * @param {Object} options
 *   A map of settings that control how the terrain is constructed and
 *   displayed. Valid values are the same as those for the `options` parameter
 *   of {@link TERRAIN.Terrain}().
 * @param {Boolean} direction
 *   `true` if the edges should be turned up; `false` if they should be turned
 *   down.
 * @param {Number} distance
 *   The distance from the center at which the edges should begin to be
 *   affected by this operation.
 * @param {Number/Function} [e=TERRAIN.Terrain.EaseInOut]
 *   A function that determines how quickly the terrain will transition between
 *   its current height and the edge shape as distance to the edge decreases.
 *   It does this by interpolating the height of each vertex along a curve.
 *   Valid values include `TERRAIN.Terrain.Linear`, `TERRAIN.Terrain.EaseIn`,
 *   `TERRAIN.Terrain.EaseOut`, `TERRAIN.Terrain.EaseInOut`,
 *   `TERRAIN.Terrain.InEaseOut`, and any custom function that accepts a float
 *   between 0 and 1 and returns a float between 0 and 1.
 */
TERRAIN.Terrain.RadialEdges = function(g, options, direction, distance, easing) {
    console.log('TERRAIN.Terrain.RadialEdges');
    var peak = direction ? options.maxHeight : options.minHeight,
        max = direction ? Math.max : Math.min,
        xl = (options.xSegments + 1),
        yl = (options.ySegments + 1),
        xl2 = xl * 0.5,
        yl2 = yl * 0.5,
        xSegmentSize = options.xSize / options.xSegments,
        ySegmentSize = options.ySize / options.ySegments,
        edgeRadius = Math.min(options.xSize, options.ySize) * 0.5 - distance,
        i, j, multiplier, k, vertexDistance;
    for (i = 0; i < xl; i++) {
        for (j = 0; j < yl2; j++) {
            k = j * xl + i;
            vertexDistance = Math.min(edgeRadius, Math.sqrt((xl2 - i) * xSegmentSize * (xl2 - i) * xSegmentSize + (yl2 - j) * ySegmentSize * (yl2 - j) * ySegmentSize) - distance);
            if (vertexDistance < 0) continue;
            multiplier = easing(vertexDistance / edgeRadius);
            g[k].z = max(g[k].z, (peak - g[k].z) * multiplier + g[k].z);
            // Use symmetry to reduce the number of iterations.
            k = (options.ySegments - j) * xl + i;
            g[k].z = max(g[k].z, (peak - g[k].z) * multiplier + g[k].z);
        }
    }
};

/**
 * Smooth the terrain by setting each point to the mean of its neighborhood.
 *
 * @param {TERRAIN.Vector3[]} g
 *   The vertex array for plane geometry to modify with heightmap data. This
 *   method sets the `z` property of each vertex.
 * @param {Object} options
 *   A map of settings that control how the terrain is constructed and
 *   displayed. Valid values are the same as those for the `options` parameter
 *   of {@link TERRAIN.Terrain}().
 * @param {Number} [weight=0]
 *   How much to weight the original vertex height against the average of its
 *   neighbors.
 */
TERRAIN.Terrain.Smooth = function(g, options, weight) {
    console.log('TERRAIN.Terrain.Smooth');
    var heightmap = new Float64Array(g.length);
    for (var i = 0, xl = options.xSegments + 1, yl = options.ySegments + 1; i < xl; i++) {
        for (var j = 0; j < yl; j++) {
            var sum = 0,
                c = 0;
            for (var n = -1; n <= 1; n++) {
                for (var m = -1; m <= 1; m++) {
                    var key = (j + n) * xl + i + m;
                    if (typeof g[key] !== 'undefined' && i + m >= 0 && j + n >= 0 && i + m < xl && j + n < yl) {
                        sum += g[key].z;
                        c++;
                    }
                }
            }
            heightmap[j * xl + i] = sum / c;
        }
    }
    weight = weight || 0;
    var w = 1 / (1 + weight);
    for (var k = 0, l = g.length; k < l; k++) {
        g[k].z = (heightmap[k] + g[k].z * weight) * w;
    }
};

/**
 * Smooth the terrain by setting each point to the median of its neighborhood.
 *
 * Parameters are the same as those for {@link TERRAIN.Terrain.DiamondSquare}.
 */
TERRAIN.Terrain.SmoothMedian = function(g, options) {
    console.log('TERRAIN.Terrain.SmoothMedian', 'no random');
    var heightmap = new Float64Array(g.length),
        neighborValues = [],
        neighborKeys = [],
        sortByValue = function(a, b) {
            return neighborValues[a] - neighborValues[b];
        };
    for (var i = 0, xl = options.xSegments + 1, yl = options.ySegments + 1; i < xl; i++) {
        for (var j = 0; j < yl; j++) {
            neighborValues.length = 0;
            neighborKeys.length = 0;
            for (var n = -1; n <= 1; n++) {
                for (var m = -1; m <= 1; m++) {
                    var key = (j + n) * xl + i + m;
                    if (typeof g[key] !== 'undefined' && i + m >= 0 && j + n >= 0 && i + m < xl && j + n < yl) {
                        neighborValues.push(g[key].z);
                        neighborKeys.push(key);
                    }
                }
            }
            neighborKeys.sort(sortByValue);
            var halfKey = Math.floor(neighborKeys.length * 0.5),
                median;
            if (neighborKeys.length % 2 === 1) {
                median = g[neighborKeys[halfKey]].z;
            } else {
                median = (g[neighborKeys[halfKey - 1]].z + g[neighborKeys[halfKey]].z) * 0.5;
            }
            heightmap[j * xl + i] = median;
        }
    }
    for (var k = 0, l = g.length; k < l; k++) {
        g[k].z = heightmap[k];
    }
};

/**
 * Smooth the terrain by clamping each point within its neighbors' extremes.
 *
 * @param {TERRAIN.Vector3[]} g
 *   The vertex array for plane geometry to modify with heightmap data. This
 *   method sets the `z` property of each vertex.
 * @param {Object} options
 *   A map of settings that control how the terrain is constructed and
 *   displayed. Valid values are the same as those for the `options` parameter
 *   of {@link TERRAIN.Terrain}().
 * @param {Number} [multiplier=1]
 *   By default, this filter clamps each point within the highest and lowest
 *   value of its neighbors. This parameter is a multiplier for the range
 *   outside of which the point will be clamped. Higher values mean that the
 *   point can be farther outside the range of its neighbors.
 */
TERRAIN.Terrain.SmoothConservative = function(g, options, multiplier) {
    console.log('TERRAIN.Terrain.SmoothConservative');
    var heightmap = new Float64Array(g.length);
    for (var i = 0, xl = options.xSegments + 1, yl = options.ySegments + 1; i < xl; i++) {
        for (var j = 0; j < yl; j++) {
            var max = -Infinity,
                min = Infinity;
            for (var n = -1; n <= 1; n++) {
                for (var m = -1; m <= 1; m++) {
                    var key = (j + n) * xl + i + m;
                    if (typeof g[key] !== 'undefined' && n && m && i + m >= 0 && j + n >= 0 && i + m < xl && j + n < yl) {
                        if (g[key].z < min) min = g[key].z;
                        if (g[key].z > max) max = g[key].z;
                    }
                }
            }
            var kk = j * xl + i;
            if (typeof multiplier === 'number') {
                var halfdiff = (max - min) * 0.5,
                    middle = min + halfdiff;
                max = middle + halfdiff * multiplier;
                min = middle - halfdiff * multiplier;
            }
            heightmap[kk] = g[kk].z > max ? max : (g[kk].z < min ? min : g[kk].z);
        }
    }
    for (var k = 0, l = g.length; k < l; k++) {
        g[k].z = heightmap[k];
    }
};

/**
 * Partition a terrain into flat steps.
 *
 * @param {TERRAIN.Vector3[]} g
 *   The vertex array for plane geometry to modify with heightmap data. This
 *   method sets the `z` property of each vertex.
 * @param {Number} [levels]
 *   The number of steps to divide the terrain into. Defaults to
 *   (g.length/2)^(1/4).
 */
TERRAIN.Terrain.Step = function(g, levels) {
    console.log('TERRAIN.Terrain.Step');
    // Calculate the max, min, and avg values for each bucket
    var i = 0,
        j = 0,
        l = g.length,
        inc = Math.floor(l / levels),
        heights = new Array(l),
        buckets = new Array(levels);
    if (typeof levels === 'undefined') {
        levels = Math.floor(Math.pow(l * 0.5, 0.25));
    }
    for (i = 0; i < l; i++) {
        heights[i] = g[i].z;
    }
    heights.sort(function(a, b) { return a - b; });
    for (i = 0; i < levels; i++) {
        // Bucket by population (bucket size) not range size
        var subset = heights.slice(i * inc, (i + 1) * inc),
            sum = 0,
            bl = subset.length;
        for (j = 0; j < bl; j++) {
            sum += subset[j];
        }
        buckets[i] = {
            min: subset[0],
            max: subset[subset.length - 1],
            avg: sum / bl,
        };
    }

    // Set the height of each vertex to the average height of its bucket
    for (i = 0; i < l; i++) {
        var startHeight = g[i].z;
        for (j = 0; j < levels; j++) {
            if (startHeight >= buckets[j].min && startHeight <= buckets[j].max) {
                g[i].z = buckets[j].avg;
                break;
            }
        }
    }
};

/**
 * Transform to turbulent noise.
 *
 * Parameters are the same as those for {@link TERRAIN.Terrain.DiamondSquare}.
 */
TERRAIN.Terrain.Turbulence = function(g, options) {
    console.log('TERRAIN.Terrain.Turbulence');
    var range = options.maxHeight - options.minHeight;
    for (var i = 0, l = g.length; i < l; i++) {
        g[i].z = options.minHeight + Math.abs((g[i].z - options.minHeight) * 2 - range);
    }
};

/**
 * A utility for generating heightmap functions by additive composition.
 *
 * @param {TERRAIN.Vector3[]} g
 *   The vertex array for plane geometry to modify with heightmap data. This
 *   method sets the `z` property of each vertex.
 * @param {Object} [options]
 *   A map of settings that control how the terrain is constructed and
 *   displayed. Valid values are the same as those for the `options` parameter
 *   of {@link TERRAIN.Terrain}().
 * @param {Object[]} passes
 *   Determines which heightmap functions to compose to create a new one.
 *   Consists of an array of objects with the following properties:
 *   - `method`: Contains something that will be passed around as an
 *     `options.heightmap` (a heightmap-generating function or a heightmap image)
 *   - `amplitude`: A multiplier for the heightmap of the pass. Applied before
 *     the result of the pass is added to the result of previous passes.
 *   - `frequency`: For terrain generation methods that support it (Perlin,
 *     Simplex, and Worley) the octave of randomness. This basically controls
 *     how big features of the terrain will be (higher frequencies result in
 *     smaller features). Often running multiple generation functions with
 *     different frequencies and amplitudes results in nice detail.
 */
TERRAIN.Terrain.MultiPass = function(g, options, passes) {
    console.log('TERRAIN.Terrain.MultiPass', 'no random');
    var clonedOptions = {};
    for (var opt in options) {
        if (options.hasOwnProperty(opt)) {
            clonedOptions[opt] = options[opt];
        }
    }
    var range = options.maxHeight - options.minHeight;
    for (var i = 0, l = passes.length; i < l; i++) {
        var amp = typeof passes[i].amplitude === 'undefined' ? 1 : passes[i].amplitude,
            move = 0.5 * (range - range * amp);
        clonedOptions.maxHeight = options.maxHeight - move;
        clonedOptions.minHeight = options.minHeight + move;
        clonedOptions.frequency = typeof passes[i].frequency === 'undefined' ? options.frequency : passes[i].frequency;
        passes[i].method(g, clonedOptions);
    }
};

/**
 * Generate random terrain using a curve.
 *
 * @param {TERRAIN.Vector3[]} g
 *   The vertex array for plane geometry to modify with heightmap data. This
 *   method sets the `z` property of each vertex.
 * @param {Object} options
 *   A map of settings that control how the terrain is constructed and
 *   displayed. Valid values are the same as those for the `options` parameter
 *   of {@link TERRAIN.Terrain}().
 * @param {Function} curve
 *   A function that takes an x- and y-coordinate and returns a z-coordinate.
 *   For example, `function(x, y) { return Math.sin(x*y*Math.PI*100); }`
 *   generates sine noise, and `function() { return Math.random(); }` sets the
 *   vertex elevations entirely randomly. The function's parameters (the x- and
 *   y-coordinates) are given as percentages of a phase (i.e. how far across
 *   the terrain in the relevant direction they are).
 */
TERRAIN.Terrain.Curve = function(g, options, curve) {
    console.log('TERRAIN.Terrain.Curve');
    var range = (options.maxHeight - options.minHeight) * 0.5,
        scalar = options.frequency / (Math.min(options.xSegments, options.ySegments) + 1);
    for (var i = 0, xl = options.xSegments + 1, yl = options.ySegments + 1; i < xl; i++) {
        for (var j = 0; j < yl; j++) {
            g[j * xl + i].z += curve(i * scalar, j * scalar) * range;
        }
    }
};

/**
 * Generate random terrain using the Cosine waves.
 *
 * Parameters are the same as those for {@link TERRAIN.Terrain.DiamondSquare}.
 */
TERRAIN.Terrain.Cosine = function(g, options) {
    console.log('TERRAIN.Terrain.Cosine');
    var amplitude = (options.maxHeight - options.minHeight) * 0.5,
        frequencyScalar = options.frequency * Math.PI / (Math.min(options.xSegments, options.ySegments) + 1),
        phase = Math.random() * Math.PI * 2;
    for (var i = 0, xl = options.xSegments + 1; i < xl; i++) {
        for (var j = 0, yl = options.ySegments + 1; j < yl; j++) {
            g[j * xl + i].z += amplitude * (Math.cos(i * frequencyScalar + phase) + Math.cos(j * frequencyScalar + phase));
        }
    }
};

/**
 * Generate random terrain using layers of Cosine waves.
 *
 * Parameters are the same as those for {@link TERRAIN.Terrain.DiamondSquare}.
 */
TERRAIN.Terrain.CosineLayers = function(g, options) {
    console.log('TERRAIN.Terrain.CosineLayers');
    TERRAIN.Terrain.MultiPass(g, options, [
        { method: TERRAIN.Terrain.Cosine, frequency: 2.5 },
        { method: TERRAIN.Terrain.Cosine, amplitude: 0.1, frequency: 12 },
        { method: TERRAIN.Terrain.Cosine, amplitude: 0.05, frequency: 15 },
        { method: TERRAIN.Terrain.Cosine, amplitude: 0.025, frequency: 20 },
    ]);
};

/**
 * Generate random terrain using the Diamond-Square method.
 *
 * Based on https://github.com/srchea/Terrain-Generation/blob/master/js/classes/TerrainGeneration.js
 *
 * @param {TERRAIN.Vector3[]} g
 *   The vertex array for plane geometry to modify with heightmap data. This
 *   method sets the `z` property of each vertex.
 * @param {Object} options
 *   A map of settings that control how the terrain is constructed and
 *   displayed. Valid values are the same as those for the `options` parameter
 *   of {@link TERRAIN.Terrain}().
 */
TERRAIN.Terrain.DiamondSquare = function(g, options) {
    console.error('TERRAIN.Terrain.DiamondSquare', 'random');
    // Set the segment length to the smallest power of 2 that is greater than
    // the number of vertices in either dimension of the plane
    var segments = TERRAIN.Math.nextPowerOfTwo(Math.max(options.xSegments, options.ySegments) + 1);

    // Initialize heightmap
    var size = segments + 1,
        heightmap = [],
        smoothing = (options.maxHeight - options.minHeight),
        i,
        j,
        xl = options.xSegments + 1,
        yl = options.ySegments + 1;
    for (i = 0; i <= segments; i++) {
        heightmap[i] = new Float64Array(segments + 1);
    }

    // Generate heightmap
    for (var l = segments; l >= 2; l /= 2) {
        var half = Math.round(l * 0.5),
            whole = Math.round(l),
            x,
            y,
            avg,
            d,
            e;
        smoothing /= 2;
        // square
        for (x = 0; x < segments; x += whole) {
            for (y = 0; y < segments; y += whole) {
                d = options.diamondSquare[0] * smoothing * 2 - smoothing;
                avg = heightmap[x][y] + // top left
                    heightmap[x + whole][y] + // top right
                    heightmap[x][y + whole] + // bottom left
                    heightmap[x + whole][y + whole]; // bottom right
                avg *= 0.25;
                heightmap[x + half][y + half] = avg + d;
            }
        }
        // diamond
        for (x = 0; x < segments; x += half) {
            for (y = (x + half) % l; y < segments; y += l) {
                d = options.diamondSquare[1] * smoothing * 2 - smoothing;
                avg = heightmap[(x - half + size) % size][y] + // middle left
                    heightmap[(x + half) % size][y] + // middle right
                    heightmap[x][(y + half) % size] + // middle top
                    heightmap[x][(y - half + size) % size]; // middle bottom
                avg *= 0.25;
                avg += d;
                heightmap[x][y] = avg;
                // top and right edges
                if (x === 0) heightmap[segments][y] = avg;
                if (y === 0) heightmap[x][segments] = avg;
            }
        }
    }

    // Apply heightmap
    for (i = 0; i < xl; i++) {
        for (j = 0; j < yl; j++) {
            g[j * xl + i].z += heightmap[i][j];
        }
    }

    // TERRAIN.Terrain.SmoothConservative(g, options);
};

/**
 * Generate random terrain using the Fault method.
 *
 * Based on http://www.lighthouse3d.com/opengl/terrain/index.php3?fault
 * Repeatedly draw random lines that cross the terrain. Raise the terrain on
 * one side of the line and lower it on the other.
 *
 * Parameters are the same as those for {@link TERRAIN.Terrain.DiamondSquare}.
 */
TERRAIN.Terrain.Fault = function(g, options) {
    console.log('TERRAIN.Terrain.Fault');
    var d = Math.sqrt(options.xSegments * options.xSegments + options.ySegments * options.ySegments),
        iterations = d * options.frequency,
        range = (options.maxHeight - options.minHeight) * 0.5,
        displacement = range / iterations,
        smoothDistance = Math.min(options.xSize / options.xSegments, options.ySize / options.ySegments) * options.frequency;
    for (var k = 0; k < iterations; k++) {
        var v = Math.random(),
            a = Math.sin(v * Math.PI * 2),
            b = Math.cos(v * Math.PI * 2),
            c = Math.random() * d - d * 0.5;
        for (var i = 0, xl = options.xSegments + 1; i < xl; i++) {
            for (var j = 0, yl = options.ySegments + 1; j < yl; j++) {
                var distance = a * i + b * j - c;
                if (distance > smoothDistance) {
                    g[j * xl + i].z += displacement;
                } else if (distance < -smoothDistance) {
                    g[j * xl + i].z -= displacement;
                } else {
                    g[j * xl + i].z += Math.cos(distance / smoothDistance * Math.PI * 2) * displacement;
                }
            }
        }
    }
    // TERRAIN.Terrain.Smooth(g, options);
};

/**
 * Generate random terrain using the Hill method.
 *
 * The basic approach is to repeatedly pick random points on or near the
 * terrain and raise a small hill around those points. Those small hills
 * eventually accumulate into large hills with distinct features.
 *
 * @param {TERRAIN.Vector3[]} g
 *   The vertex array for plane geometry to modify with heightmap data. This
 *   method sets the `z` property of each vertex.
 * @param {Object} options
 *   A map of settings that control how the terrain is constructed and
 *   displayed. Valid values are the same as those for the `options` parameter
 *   of {@link TERRAIN.Terrain}().
 * @param {Function} [feature=TERRAIN.Terrain.Influences.Hill]
 *   A function describing the feature to raise at the randomly chosen points.
 *   Typically this is a hill shape so that the accumulated features result in
 *   something resembling mountains, but it could be any function that accepts
 *   one parameter representing the distance from the feature's origin
 *   expressed as a number between -1 and 1 inclusive. Optionally it can accept
 *   a second and third parameter, which are the x- and y- distances from the
 *   feature's origin, respectively. It should return a number between -1 and 1
 *   representing the height of the feature at the given coordinate.
 *   `TERRAIN.Terrain.Influences` contains some useful functions for this
 *   purpose.
 * @param {Function} [shape]
 *   A function that takes an object with `x` and `y` properties consisting of
 *   uniform random variables from 0 to 1, and returns a number from 0 to 1,
 *   typically by transforming it over a distribution. The result affects where
 *   small hills are raised thereby affecting the overall shape of the terrain.
 */
TERRAIN.Terrain.Hill = function(g, options, feature, shape) {
    console.log('TERRAIN.Terrain.Hill');
    var frequency = options.frequency * 2,
        numFeatures = frequency * frequency * 10,
        heightRange = options.maxHeight - options.minHeight,
        minHeight = heightRange / (frequency * frequency),
        maxHeight = heightRange / frequency,
        smallerSideLength = Math.min(options.xSize, options.ySize),
        minRadius = smallerSideLength / (frequency * frequency),
        maxRadius = smallerSideLength / frequency;
    feature = feature || TERRAIN.Terrain.Influences.Hill;

    var coords = { x: 0, y: 0 };
    for (var i = 0; i < numFeatures; i++) {
        var radius = Math.random() * (maxRadius - minRadius) + minRadius,
            height = Math.random() * (maxHeight - minHeight) + minHeight;
        var min = 0 - radius,
            maxX = options.xSize + radius,
            maxY = options.ySize + radius;
        coords.x = Math.random();
        coords.y = Math.random();
        if (typeof shape === 'function') shape(coords);
        TERRAIN.Terrain.Influence(
            g, options,
            feature,
            coords.x, coords.y,
            radius, height,
            TERRAIN.AdditiveBlending,
            TERRAIN.Terrain.EaseInStrong
        );
    }
};

/**
 * Generate random terrain using the Hill method, centered on the terrain.
 *
 * The only difference between this and the Hill method is that the locations
 * of the points to place small hills are not uniformly randomly distributed
 * but instead are more likely to occur close to the center of the terrain.
 *
 * @param {TERRAIN.Vector3[]} g
 *   The vertex array for plane geometry to modify with heightmap data. This
 *   method sets the `z` property of each vertex.
 * @param {Object} options
 *   A map of settings that control how the terrain is constructed and
 *   displayed. Valid values are the same as those for the `options` parameter
 *   of {@link TERRAIN.Terrain}().
 * @param {Function} [feature=TERRAIN.Terrain.Influences.Hill]
 *   A function describing the feature. The function should accept one
 *   parameter representing the distance from the feature's origin expressed as
 *   a number between -1 and 1 inclusive. Optionally it can accept a second and
 *   third parameter, which are the x- and y- distances from the feature's
 *   origin, respectively. It should return a number between -1 and 1
 *   representing the height of the feature at the given coordinate.
 *   `TERRAIN.Terrain.Influences` contains some useful functions for this
 *   purpose.
 */
TERRAIN.Terrain.HillIsland = (function() {
    // console.error('TERRAIN.Terrain.HillIsland', 'random');
    var island = function(coords) {
        var theta = /*Math.random()*/ 0.5 * Math.PI * 2;
        coords.x = 0.5 + Math.cos(theta) * coords.x * 0.4;
        coords.y = 0.5 + Math.sin(theta) * coords.y * 0.4;
    };
    return function(g, options, feature) {
        TERRAIN.Terrain.Hill(g, options, feature, island);
    };
})();

(function() {
    /**
     * Deposit a particle at a vertex.
     */
    function deposit(g, i, j, xl, displacement) {
        var currentKey = j * xl + i;
        // Pick a random neighbor.
        for (var k = 0; k < 3; k++) {
            var r = Math.floor(Math.random() * 8);
            switch (r) {
                case 0:
                    i++;
                    break;
                case 1:
                    i--;
                    break;
                case 2:
                    j++;
                    break;
                case 3:
                    j--;
                    break;
                case 4:
                    i++;
                    j++;
                    break;
                case 5:
                    i++;
                    j--;
                    break;
                case 6:
                    i--;
                    j++;
                    break;
                case 7:
                    i--;
                    j--;
                    break;
            }
            var neighborKey = j * xl + i;
            // If the neighbor is lower, move the particle to that neighbor and re-evaluate.
            if (typeof g[neighborKey] !== 'undefined') {
                if (g[neighborKey].z < g[currentKey].z) {
                    deposit(g, i, j, xl, displacement);
                    return;
                }
            }
            // Deposit some particles on the edge.
            else if (Math.random() < 0.2) {
                g[currentKey].z += displacement;
                return;
            }
        }
        g[currentKey].z += displacement;
    }

    /**
     * Generate random terrain using the Particle Deposition method.
     *
     * Based on http://www.lighthouse3d.com/opengl/terrain/index.php?particle
     * Repeatedly deposit particles on terrain vertices. Pick a random neighbor
     * of that vertex. If the neighbor is lower, roll the particle to the
     * neighbor. When the particle stops, displace the vertex upwards.
     *
     * The shape of the outcome is highly dependent on options.frequency
     * because that affects how many particles will be dropped. Values around
     * 0.25 generally result in archipelagos whereas the default of 2.5
     * generally results in one large mountainous island.
     *
     * Parameters are the same as those for {@link TERRAIN.Terrain.DiamondSquare}.
     */
    TERRAIN.Terrain.Particles = function(g, options) {
        console.log('TERRAIN.Terrain.Particles');
        var iterations = Math.sqrt(options.xSegments * options.xSegments + options.ySegments * options.ySegments) * options.frequency * 300,
            xl = options.xSegments + 1,
            displacement = (options.maxHeight - options.minHeight) / iterations * 1000,
            i = Math.floor(Math.random() * options.xSegments),
            j = Math.floor(Math.random() * options.ySegments),
            xDeviation = Math.random() * 0.2 - 0.1,
            yDeviation = Math.random() * 0.2 - 0.1;
        for (var k = 0; k < iterations; k++) {
            deposit(g, i, j, xl, displacement);
            var d = Math.random() * Math.PI * 2;
            if (k % 1000 === 0) {
                xDeviation = Math.random() * 0.2 - 0.1;
                yDeviation = Math.random() * 0.2 - 0.1;
            }
            if (k % 100 === 0) {
                i = Math.floor(options.xSegments * (0.5 + xDeviation) + Math.cos(d) * Math.random() * options.xSegments * (0.5 - Math.abs(xDeviation)));
                j = Math.floor(options.ySegments * (0.5 + yDeviation) + Math.sin(d) * Math.random() * options.ySegments * (0.5 - Math.abs(yDeviation)));
            }
        }
        // TERRAIN.Terrain.Smooth(g, options, 3);
    };
})();

/**
 * Generate random terrain using the Perlin Noise method.
 *
 * Parameters are the same as those for {@link TERRAIN.Terrain.DiamondSquare}.
 */
TERRAIN.Terrain.Perlin = function(g, options) {
    console.log('TERRAIN.Terrain.Perlin', 'no random');
    let x, y
    noise.seed(options.seed)
    let divisor = 500 * options.frequency;
    let range = (options.maxHeight - options.minHeight) * 0.5;
    for (let index = 2; index < g.length; index = index + 3) {

        x = (g[index - 2] + options.position.x) / divisor
        y = (g[index - 1] + options.position.z) / divisor
        g[index] = noise.perlin(x, y) * range
    }

    // g.forEach(vertice => {
    //     x = (vertice.x + options.position.x) / divisor
    //     y = (vertice.y + options.position.z) / divisor
    //     vertice.z = noise.perlin(x, y) * range
    // });
};

/**
 * Generate random terrain using the Perlin and Diamond-Square methods composed.
 *
 * Parameters are the same as those for {@link TERRAIN.Terrain.DiamondSquare}.
 */
TERRAIN.Terrain.PerlinDiamond = function(g, options) {
    console.log('TERRAIN.Terrain.PerlinDiamond', 'no random');
    TERRAIN.Terrain.MultiPass(g, options, [
        { method: TERRAIN.Terrain.Perlin },
        { method: TERRAIN.Terrain.DiamondSquare, amplitude: 0.75 },
        { method: function(g, o) { return TERRAIN.Terrain.SmoothMedian(g, o); } },
    ]);
};

/**
 * Generate random terrain using layers of Perlin noise.
 *
 * Parameters are the same as those for {@link TERRAIN.Terrain.DiamondSquare}.
 */
TERRAIN.Terrain.PerlinLayers = function(g, options) {
    console.log('TERRAIN.Terrain.PerlinLayers');
    TERRAIN.Terrain.MultiPass(g, options, [
        { method: TERRAIN.Terrain.Perlin, frequency: 1.25 },
        { method: TERRAIN.Terrain.Perlin, amplitude: 0.05, frequency: 2.5 },
        { method: TERRAIN.Terrain.Perlin, amplitude: 0.35, frequency: 5 },
        { method: TERRAIN.Terrain.Perlin, amplitude: 0.15, frequency: 10 },
    ]);
};

/**
 * Generate random terrain using the Simplex Noise method.
 *
 * Parameters are the same as those for {@link TERRAIN.Terrain.DiamondSquare}.
 *
 * See https://github.com/mrdoob/three.js/blob/master/examples/webgl_terrain_dynamic.html
 * for an interesting comparison where the generation happens in GLSL.
 */
TERRAIN.Terrain.Simplex = function(g, options) {
    console.log('TERRAIN.Terrain.Simplex');
    noise.seed(Math.random());
    var range = (options.maxHeight - options.minHeight) * 0.5,
        divisor = (Math.min(options.xSegments, options.ySegments) + 1) * 2 / options.frequency;
    for (var i = 0, xl = options.xSegments + 1; i < xl; i++) {
        for (var j = 0, yl = options.ySegments + 1; j < yl; j++) {
            g[j * xl + i].z += noise.simplex(i / divisor, j / divisor) * range;
        }
    }
};

/**
 * Generate random terrain using layers of Simplex noise.
 *
 * Parameters are the same as those for {@link TERRAIN.Terrain.DiamondSquare}.
 */
TERRAIN.Terrain.SimplexLayers = function(g, options) {
    console.log('TERRAIN.Terrain.SimplexLayers');
    TERRAIN.Terrain.MultiPass(g, options, [
        { method: TERRAIN.Terrain.Simplex, frequency: 1.25 },
        { method: TERRAIN.Terrain.Simplex, amplitude: 0.5, frequency: 2.5 },
        { method: TERRAIN.Terrain.Simplex, amplitude: 0.25, frequency: 5 },
        { method: TERRAIN.Terrain.Simplex, amplitude: 0.125, frequency: 10 },
        { method: TERRAIN.Terrain.Simplex, amplitude: 0.0625, frequency: 20 },
    ]);
};

(function() {
    /**
     * Generate a heightmap using white noise.
     *
     * @param {TERRAIN.Vector3[]} g The terrain vertices.
     * @param {Object} options Settings
     * @param {Number} scale The resolution of the resulting heightmap.
     * @param {Number} segments The width of the target heightmap.
     * @param {Number} range The altitude of the noise.
     * @param {Number[]} data The target heightmap.
     */
    function WhiteNoise(g, options, scale, segments, range, data) {
        if (scale > segments) return;
        var i = 0,
            j = 0,
            xl = segments,
            yl = segments,
            inc = Math.floor(segments / scale),
            lastX = -inc,
            lastY = -inc;
        // Walk over the target. For a target of size W and a resolution of N,
        // set every W/N points (in both directions).
        for (i = 0; i <= xl; i += inc) {
            for (j = 0; j <= yl; j += inc) {
                var k = j * xl + i;
                data[k] = Math.random() * range;
                if (lastX < 0 && lastY < 0) continue;
                // jscs:disable disallowSpacesInsideBrackets
                /* c b *
                 * l t */
                var t = data[k],
                    l = data[j * xl + (i - inc)] || t, // left
                    b = data[(j - inc) * xl + i] || t, // bottom
                    c = data[(j - inc) * xl + (i - inc)] || t; // corner
                // jscs:enable disallowSpacesInsideBrackets
                // Interpolate between adjacent points to set the height of
                // higher-resolution target data.
                for (var x = lastX; x < i; x++) {
                    for (var y = lastY; y < j; y++) {
                        if (x === lastX && y === lastY) continue;
                        var z = y * xl + x;
                        if (z < 0) continue;
                        var px = ((x - lastX) / inc),
                            py = ((y - lastY) / inc),
                            r1 = px * b + (1 - px) * c,
                            r2 = px * t + (1 - px) * l;
                        data[z] = py * r2 + (1 - py) * r1;
                    }
                }
                lastY = j;
            }
            lastX = i;
            lastY = -inc;
        }
        // Assign the temporary data back to the actual terrain heightmap.
        for (i = 0, xl = options.xSegments + 1; i < xl; i++) {
            for (j = 0, yl = options.ySegments + 1; j < yl; j++) {
                // http://stackoverflow.com/q/23708306/843621
                var kg = j * xl + i,
                    kd = j * segments + i;
                g[kg].z += data[kd];
            }
        }
    }

    /**
     * Generate random terrain using value noise.
     *
     * The basic approach of value noise is to generate white noise at a
     * smaller octave than the target and then interpolate to get a higher-
     * resolution result. This is then repeated at different resolutions.
     *
     * Parameters are the same as those for {@link TERRAIN.Terrain.DiamondSquare}.
     */
    TERRAIN.Terrain.Value = function(g, options) {
        console.log('TERRAIN.Terrain.Value');
        // Set the segment length to the smallest power of 2 that is greater
        // than the number of vertices in either dimension of the plane
        var segments = TERRAIN.Math.nextPowerOfTwo(Math.max(options.xSegments, options.ySegments) + 1);

        // Store the array of white noise outside of the WhiteNoise function to
        // avoid allocating a bunch of unnecessary arrays; we can just
        // overwrite old data each time WhiteNoise() is called.
        var data = new Float64Array((segments + 1) * (segments + 1));

        // Layer white noise at different resolutions.
        var range = options.maxHeight - options.minHeight;
        for (var i = 2; i < 7; i++) {
            WhiteNoise(g, options, Math.pow(2, i), segments, range * Math.pow(2, 2.4 - i * 1.2), data);
        }

        // White noise creates some weird artifacts; fix them.
        // TERRAIN.Terrain.Smooth(g, options, 1);
        TERRAIN.Terrain.Clamp(g, {
            maxHeight: options.maxHeight,
            minHeight: options.minHeight,
            stretch: true,
        });
    };
})();

/**
 * Generate random terrain using Weierstrass functions.
 *
 * Weierstrass functions are known for being continuous but not differentiable
 * anywhere. This produces some nice shapes that look terrain-like, but can
 * look repetitive from above.
 *
 * Parameters are the same as those for {@link TERRAIN.Terrain.DiamondSquare}.
 */
TERRAIN.Terrain.Weierstrass = function(g, options) {
    console.log('TERRAIN.Terrain.Weierstrass');
    var range = (options.maxHeight - options.minHeight) * 0.5,
        dir1 = Math.random() < 0.5 ? 1 : -1,
        dir2 = Math.random() < 0.5 ? 1 : -1,
        r11 = 0.5 + Math.random() * 1.0,
        r12 = 0.5 + Math.random() * 1.0,
        r13 = 0.025 + Math.random() * 0.10,
        r14 = -1.0 + Math.random() * 2.0,
        r21 = 0.5 + Math.random() * 1.0,
        r22 = 0.5 + Math.random() * 1.0,
        r23 = 0.025 + Math.random() * 0.10,
        r24 = -1.0 + Math.random() * 2.0;
    for (var i = 0, xl = options.xSegments + 1; i < xl; i++) {
        for (var j = 0, yl = options.ySegments + 1; j < yl; j++) {
            var sum = 0;
            for (var k = 0; k < 20; k++) {
                var x = Math.pow(1 + r11, -k) * Math.sin(Math.pow(1 + r12, k) * (i + 0.25 * Math.cos(j) + r14 * j) * r13);
                var y = Math.pow(1 + r21, -k) * Math.sin(Math.pow(1 + r22, k) * (j + 0.25 * Math.cos(i) + r24 * i) * r23);
                sum -= Math.exp(dir1 * x * x + dir2 * y * y);
            }
            g[j * xl + i].z += sum * range;
        }
    }
    TERRAIN.Terrain.Clamp(g, options);
};

/**
 * Generate a material that blends together textures based on vertex height.
 *
 * Inspired by http://www.chandlerprall.com/2011/06/blending-webgl-textures/
 *
 * Usage:
 *
 *    // Assuming the textures are already loaded
 *    var material = TERRAIN.Terrain.generateBlendedMaterial([
 *      {texture: TERRAIN.ImageUtils.loadTexture('img1.jpg')},
 *      {texture: TERRAIN.ImageUtils.loadTexture('img2.jpg'), levels: [-80, -35, 20, 50]},
 *      {texture: TERRAIN.ImageUtils.loadTexture('img3.jpg'), levels: [20, 50, 60, 85]},
 *      {texture: TERRAIN.ImageUtils.loadTexture('img4.jpg'), glsl: '1.0 - smoothstep(65.0 + smoothstep(-256.0, 256.0, vPosition.x) * 10.0, 80.0, vPosition.z)'},
 *    ]);
 *
 * This material tries to behave exactly like a MeshLambertMaterial other than
 * the fact that it blends multiple texture maps together, although
 * ShaderMaterials are treated slightly differently by Three.js so YMMV. Note
 * that this means the texture will appear black unless there are lights
 * shining on it.
 *
 * @param {Object[]} textures
 *   An array of objects specifying textures to blend together and how to blend
 *   them. Each object should have a `texture` property containing a
 *   `TERRAIN.Texture` instance. There must be at least one texture and the first
 *   texture does not need any other properties because it will serve as the
 *   base, showing up wherever another texture isn't blended in. Other textures
 *   must have either a `levels` property containing an array of four numbers
 *   or a `glsl` property containing a single GLSL expression evaluating to a
 *   float between 0.0 and 1.0. For the `levels` property, the four numbers
 *   are, in order: the height at which the texture will start blending in, the
 *   height at which it will be fully blended in, the height at which it will
 *   start blending out, and the height at which it will be fully blended out.
 *   The `vec3 vPosition` variable is available to `glsl` expressions; it
 *   contains the coordinates in Three-space of the texel currently being
 *   rendered.
 */
TERRAIN.Terrain.generateBlendedMaterial = function(textures) {
    console.log('TERRAIN.Terrain.generateBlendedMaterial', 'no random');
    // Convert numbers to strings of floats so GLSL doesn't barf on "1" instead of "1.0"
    function glslifyNumber(n) {
        return n === (n | 0) ? n + '.0' : n + '';
    }

    var uniforms = THREE.UniformsUtils.merge([THREE.ShaderLib.lambert.uniforms]),
        declare = '',
        assign = '',
        t0Repeat = textures[0].texture.repeat,
        t0Offset = textures[0].texture.offset;

    //
    for (var i = 0, l = textures.length; i < l; i++) {
        // Uniforms
        textures[i].texture.wrapS = TERRAIN.RepeatWrapping;
        textures[i].texture.wrapT = TERRAIN.RepeatWrapping;
        textures[i].texture.needsUpdate = true;
        uniforms['texture_' + i] = {
            type: 't',
            value: textures[i].texture,
        };

        // Shader fragments
        // Declare each texture, then mix them together.
        declare += 'uniform sampler2D texture_' + i + ';\n';
        if (i !== 0) {
            var v = textures[i].levels, // Vertex heights at which to blend textures in and out
                p = textures[i].glsl, // Or specify a GLSL expression that evaluates to a float between 0.0 and 1.0 indicating how opaque the texture should be at this texel
                useLevels = typeof v !== 'undefined', // Use levels if they exist; otherwise, use the GLSL expression
                tiRepeat = textures[i].texture.repeat,
                tiOffset = textures[i].texture.offset;
            if (useLevels) {
                // Must fade in; can't start and stop at the same point.
                // So, if levels are too close, move one of them slightly.
                if (v[1] - v[0] < 1) v[0] -= 1;
                if (v[3] - v[2] < 1) v[3] += 1;
                for (var j = 0; j < v.length; j++) {
                    v[j] = glslifyNumber(v[j]);
                }
            }
            // The transparency of the new texture when it is layered on top of the existing color at this texel is
            // (how far between the start-blending-in and fully-blended-in levels the current vertex is) +
            // (how far between the start-blending-out and fully-blended-out levels the current vertex is)
            // So the opacity is 1.0 minus that.
            var blendAmount = !useLevels ? p :
                '1.0 - smoothstep(' + v[0] + ', ' + v[1] + ', vPosition.z) + smoothstep(' + v[2] + ', ' + v[3] + ', vPosition.z)';
            assign += '        color = mix( ' +
                // 'texture2D( texture_' + i + ', MyvUv * vec2( ' + glslifyNumber(tiRepeat.x) + ', ' + glslifyNumber(tiRepeat.y) + ' ) + vec2(sin(MyvUv.x)*100.0, cos(MyvUv.x)*100.0) ), ' +
                'texture2D( texture_' + i + ', MyvUv * vec2( ' + glslifyNumber(tiRepeat.x) + ', ' + glslifyNumber(tiRepeat.y) + ' ) + vec2( ' + glslifyNumber(tiOffset.x) + ', ' + glslifyNumber(tiOffset.y) + ' ) ), ' +
                'color, ' +
                'max(min(' + blendAmount + ', 1.0), 0.0)' +
                ');\n';
        }
    }

    var params = {
        // I don't know which of these properties have any effect
        fog: true,
        lights: true,
        // shading: TERRAIN.SmoothShading,
        // blending: TERRAIN.NormalBlending,
        // depthTest: <bool>,
        // depthWrite: <bool>,
        // wireframe: true,
        // wireframeLinewidth: 1,
        // vertexColors: TERRAIN.NoColors,
        // skinning: <bool>,
        // morphTargets: <bool>,
        // morphNormals: <bool>,
        // opacity: 1.0,
        // transparent: <bool>,
        // side: TERRAIN.FrontSide,

        uniforms: uniforms,
        vertexShader: THREE.ShaderLib.lambert.vertexShader.replace(
            'void main() {',
            `varying vec2 MyvUv;
            varying vec3 vPosition;\
            varying vec3 myNormal; void main() {\nMyvUv = uv;\nvPosition = position;\nmyNormal = normal;`
        ),
        // This is mostly copied from TERRAIN.ShaderLib.lambert.fragmentShader
        fragmentShader: [
            'uniform vec3 diffuse;',
            'uniform vec3 emissive;',
            'uniform float opacity;',
            'varying vec3 vLightFront;',
            '#ifdef DOUBLE_SIDED',
            '    varying vec3 vLightBack;',
            '#endif',

            THREE.ShaderChunk.common,
            THREE.ShaderChunk.packing,
            THREE.ShaderChunk.dithering_pars_fragment,
            THREE.ShaderChunk.color_pars_fragment,
            THREE.ShaderChunk.uv_pars_fragment,
            THREE.ShaderChunk.uv2_pars_fragment,
            THREE.ShaderChunk.map_pars_fragment,
            THREE.ShaderChunk.alphamap_pars_fragment,
            THREE.ShaderChunk.aomap_pars_fragment,
            THREE.ShaderChunk.lightmap_pars_fragment,
            THREE.ShaderChunk.emissivemap_pars_fragment,
            THREE.ShaderChunk.envmap_pars_fragment,
            THREE.ShaderChunk.bsdfs,
            THREE.ShaderChunk.lights_pars_begin,
            THREE.ShaderChunk.lights_pars_maps,
            THREE.ShaderChunk.fog_pars_fragment,
            THREE.ShaderChunk.shadowmap_pars_fragment,
            THREE.ShaderChunk.shadowmask_pars_fragment,
            THREE.ShaderChunk.specularmap_pars_fragment,
            THREE.ShaderChunk.logdepthbuf_pars_fragment,
            THREE.ShaderChunk.clipping_planes_pars_fragment,

            declare,
            'varying vec2 MyvUv;',
            'varying vec3 vPosition;',
            'varying vec3 myNormal;',

            'void main() {',

            THREE.ShaderChunk.clipping_planes_fragment,

            'ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );',
            'vec3 totalEmissiveRadiance = emissive;',

            // TODO: The second vector here is the object's "up" vector. Ideally we'd just pass it in directly.
            'float slope = acos(max(min(dot(myNormal, vec3(0.0, 0.0, 1.0)), 1.0), -1.0));',

            '    vec4 diffuseColor = vec4( diffuse, opacity );',
            '    vec4 color = texture2D( texture_0, MyvUv * vec2( ' + glslifyNumber(t0Repeat.x) + ', ' + glslifyNumber(t0Repeat.y) + ' ) + vec2( ' + glslifyNumber(t0Offset.x) + ', ' + glslifyNumber(t0Offset.y) + ' ) ); // base',
            assign,
            '    diffuseColor = color;',
            // '    gl_FragColor = color;',

            THREE.ShaderChunk.logdepthbuf_fragment,
            THREE.ShaderChunk.map_fragment,
            THREE.ShaderChunk.color_fragment,
            THREE.ShaderChunk.alphamap_fragment,
            THREE.ShaderChunk.alphatest_fragment,
            THREE.ShaderChunk.specularmap_fragment,
            THREE.ShaderChunk.emissivemap_fragment,

            // accumulation
            '   reflectedLight.indirectDiffuse = getAmbientLightIrradiance( ambientLightColor );',

            THREE.ShaderChunk.lightmap_fragment,

            '    reflectedLight.indirectDiffuse *= BRDF_Diffuse_Lambert( diffuseColor.rgb );',
            '    #ifdef DOUBLE_SIDED',
            '            reflectedLight.directDiffuse = ( gl_FrontFacing ) ? vLightFront : vLightBack;',
            '    #else',
            '            reflectedLight.directDiffuse = vLightFront;',
            '    #endif',
            '    reflectedLight.directDiffuse *= BRDF_Diffuse_Lambert( diffuseColor.rgb ) * getShadowMask();',

            // modulation
            THREE.ShaderChunk.aomap_fragment,
            '   vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;',
            THREE.ShaderChunk.normal_flip,
            THREE.ShaderChunk.envmap_fragment,
            '   gl_FragColor = vec4( outgoingLight, diffuseColor.a );', // This will probably change in future three.js releases
            THREE.ShaderChunk.tonemapping_fragment,
            THREE.ShaderChunk.encodings_fragment,
            THREE.ShaderChunk.fog_fragment,
            THREE.ShaderChunk.premultiplied_alpha_fragment,
            THREE.ShaderChunk.dithering_fragment,
            '}'
        ].join('\n'),
    };
    return new THREE.ShaderMaterial(params);
};

/**
 * Scatter a mesh across the terrain.
 *
 * @param {TERRAIN.Geometry} geometry
 *   The terrain's geometry (or the highest-resolution version of it).
 * @param {Object} options
 *   A map of settings that controls how the meshes are scattered, with the
 *   following properties:
 *   - `mesh`: A `TERRAIN.Mesh` instance to scatter across the terrain.
 *   - `spread`: A number or a function that affects where meshes are placed.
 *     If it is a number, it represents the percent of faces of the terrain
 *     onto which a mesh should be placed. If it is a function, it takes a
 *     vertex from the terrain and the key of a related face and returns a
 *     boolean indicating whether to place a mesh on that face or not. An
 *     example could be `function(v, k) { return v.z > 0 && !(k % 4); }`.
 *     Defaults to 0.025.
 *   - `smoothSpread`: If the `spread` option is a number, this affects how
 *     much placement is "eased in." Specifically, if the `randomness` function
 *     returns a value for a face that is within `smoothSpread` percentiles
 *     above `spread`, then the probability that a mesh is placed there is
 *     interpolated between zero and `spread`. This creates a "thinning" effect
 *     near the edges of clumps, if the randomness function creates clumps.
 *   - `scene`: A `TERRAIN.Object3D` instance to which the scattered meshes will
 *     be added. This is expected to be either a return value of a call to
 *     `TERRAIN.Terrain()` or added to that return value; otherwise the position
 *     and rotation of the meshes will be wrong.
 *   - `sizeVariance`: The percent by which instances of the mesh can be scaled
 *     up or down when placed on the terrain.
 *   - `randomness`: If `options.spread` is a number, then this property is a
 *     function that determines where meshes are placed. Specifically, it
 *     returns an array of numbers, where each number is the probability that
 *     a mesh is NOT placed on the corresponding face. Valid values include
 *     `Math.random` and the return value of a call to
 *     `TERRAIN.Terrain.ScatterHelper`.
 *   - `maxSlope`: The angle in radians between the normal of a face of the
 *     terrain and the "up" vector above which no mesh will be placed on the
 *     related face. Defaults to ~0.63, which is 36 degrees.
 *   - `maxTilt`: The maximum angle in radians a mesh can be tilted away from
 *     the "up" vector (towards the normal vector of the face of the terrain).
 *     Defaults to Infinity (meshes will point towards the normal).
 *   - `w`: The number of horizontal segments of the terrain.
 *   - `h`: The number of vertical segments of the terrain.
 *
 * @return {TERRAIN.Object3D}
 *   An Object3D containing the scattered meshes. This is the value of the
 *   `options.scene` parameter if passed. This is expected to be either a
 *   return value of a call to `TERRAIN.Terrain()` or added to that return value;
 *   otherwise the position and rotation of the meshes will be wrong.
 */
TERRAIN.Terrain.ScatterMeshes = function(geometry, options) {
    console.log('TERRAIN.Terrain.ScatterMeshes');
    if (!options.mesh) {
        console.error('options.mesh is required for TERRAIN.Terrain.ScatterMeshes but was not passed');
        return;
    }
    if (geometry instanceof TERRAIN.BufferGeometry) {
        console.warn('The terrain mesh is using BufferGeometry but TERRAIN.Terrain.ScatterMeshes can only work with Geometry.');
        return;
    }
    if (!options.scene) {
        options.scene = new THREE.Object3D();
    }
    var defaultOptions = {
        spread: 0.025,
        smoothSpread: 0,
        sizeVariance: 0.1,
        randomness: Math.random,
        maxSlope: 0.6283185307179586, // 36deg or 36 / 180 * Math.PI, about the angle of repose of earth
        maxTilt: Infinity,
        w: 0,
        h: 0,
    };
    for (var opt in defaultOptions) {
        if (defaultOptions.hasOwnProperty(opt)) {
            options[opt] = typeof options[opt] === 'undefined' ? defaultOptions[opt] : options[opt];
        }
    }

    var spreadIsNumber = typeof options.spread === 'number',
        randomHeightmap,
        randomness,
        spreadRange = 1 / options.smoothSpread,
        doubleSizeVariance = options.sizeVariance * 2,
        v = geometry.vertices,
        meshes = [],
        up = options.mesh.up.clone().applyAxisAngle(new THREE.Vector3(1, 0, 0), 0.5 * Math.PI);
    if (spreadIsNumber) {
        randomHeightmap = options.randomness();
        randomness = typeof randomHeightmap === 'number' ? Math.random : function(k) { return randomHeightmap[k]; };
    }
    // geometry.computeFaceNormals();
    for (var i = 0, w = options.w * 2; i < w; i++) {
        for (var j = 0, h = options.h; j < h; j++) {
            var key = j * w + i,
                f = geometry.faces[key],
                place = false;
            if (spreadIsNumber) {
                var rv = randomness(key);
                if (rv < options.spread) {
                    place = true;
                } else if (rv < options.spread + options.smoothSpread) {
                    // Interpolate rv between spread and spread + smoothSpread,
                    // then multiply that "easing" value by the probability
                    // that a mesh would get placed on a given face.
                    place = TERRAIN.Terrain.EaseInOut((rv - options.spread) * spreadRange) * options.spread > Math.random();
                }
            } else {
                place = options.spread(v[f.a], key, f, i, j);
            }
            if (place) {
                // Don't place a mesh if the angle is too steep.
                if (f.normal.angleTo(up) > options.maxSlope) {
                    continue;
                }
                var mesh = options.mesh.clone();
                // mesh.geometry.computeBoundingBox();
                mesh.position.copy(v[f.a]).add(v[f.b]).add(v[f.c]).divideScalar(3);
                // mesh.translateZ((mesh.geometry.boundingBox.max.z - mesh.geometry.boundingBox.min.z) * 0.5);
                if (options.maxTilt > 0) {
                    var normal = mesh.position.clone().add(f.normal);
                    mesh.lookAt(normal);
                    var tiltAngle = f.normal.angleTo(up);
                    if (tiltAngle > options.maxTilt) {
                        var ratio = options.maxTilt / tiltAngle;
                        mesh.rotation.x *= ratio;
                        mesh.rotation.y *= ratio;
                        mesh.rotation.z *= ratio;
                    }
                }
                mesh.rotation.x += 90 / 180 * Math.PI;
                mesh.rotateY(Math.random() * 2 * Math.PI);
                if (options.sizeVariance) {
                    var variance = Math.random() * doubleSizeVariance - options.sizeVariance;
                    mesh.scale.x = mesh.scale.z = 1 + variance;
                    mesh.scale.y += variance;
                }
                meshes.push(mesh);
            }
        }
    }

    // Merge geometries.
    var k, l;
    if (options.mesh.geometry instanceof TERRAIN.Geometry) {
        var g = new THREE.Geometry();
        for (k = 0, l = meshes.length; k < l; k++) {
            var m = meshes[k];
            m.updateMatrix();
            g.merge(m.geometry, m.matrix);
        }
        /*
        if (!(options.mesh.material instanceof TERRAIN.MeshFaceMaterial)) {
            g = TERRAIN.BufferGeometryUtils.fromGeometry(g);
        }
        */
        options.scene.add(new THREE.Mesh(g, options.mesh.material));
    }
    // There's no BufferGeometry merge method implemented yet.
    else {
        for (k = 0, l = meshes.length; k < l; k++) {
            options.scene.add(meshes[k]);
        }
    }

    return options.scene;
};

/**
 * Generate a function that returns a heightmap to pass to ScatterMeshes.
 *
 * Specifically, this function generates a heightmap and then uses that
 * heightmap as a map of probabilities of where meshes will be placed.
 *
 * @param {Function} method
 *   A random terrain generation function (i.e. a valid value for the
 *   `options.heightmap` parameter of the `TERRAIN.Terrain` function).
 * @param {Object} options
 *   A map of settings that control how the resulting noise should be generated
 *   (with the same parameters as the `options` parameter to the
 *   `TERRAIN.Terrain` function). `options.minHeight` must equal `0` and
 *   `options.maxHeight` must equal `1` if they are specified.
 * @param {Number} skip
 *   The number of sequential faces to skip between faces that are candidates
 *   for placing a mesh. This avoid clumping meshes too closely together.
 *   Defaults to 1.
 * @param {Number} threshold
 *   The probability that, if a mesh can be placed on a non-skipped face due to
 *   the shape of the heightmap, a mesh actually will be placed there. Helps
 *   thin out placement and make it less regular. Defaults to 0.25.
 *
 * @return {Function}
 *   Returns a function that can be passed as the value of the
 *   `options.randomness` parameter to the {@link TERRAIN.Terrain.ScatterMeshes}
 *   function.
 */
TERRAIN.Terrain.ScatterHelper = function(method, options, skip, threshold) {
    console.log('TERRAIN.Terrain.ScatterHelper');
    skip = skip || 1;
    threshold = threshold || 0.25;
    options.frequency = options.frequency || 2.5;

    var clonedOptions = {};
    for (var opt in options) {
        if (options.hasOwnProperty(opt)) {
            clonedOptions[opt] = options[opt];
        }
    }

    clonedOptions.xSegments *= 2;
    clonedOptions.stretch = true;
    clonedOptions.maxHeight = 1;
    clonedOptions.minHeight = 0;
    var heightmap = TERRAIN.Terrain.heightmapArray(method, clonedOptions);

    for (var i = 0, l = heightmap.length; i < l; i++) {
        if (i % skip || Math.random() > threshold) {
            heightmap[i] = 1; // 0 = place, 1 = don't place
        }
    }
    return function() {
        return heightmap;
    };
};

// Allows placing geometrically-described features on a terrain.
// If you want these features to look a little less regular,
// just apply them before a procedural pass.
// If you want more complex influence, you can just composite heightmaps.

/**
 * Equations describing geographic features.
 */
TERRAIN.Terrain.Influences = {
    Mesa: function(x) {
        return 1.25 * Math.min(0.8, Math.exp(-(x * x)));
    },
    Hole: function(x) {
        return -TERRAIN.Terrain.Influences.Mesa(x);
    },
    Hill: function(x) {
        // Same curve as EaseInOut, but mirrored and translated.
        return x < 0 ? (x + 1) * (x + 1) * (3 - 2 * (x + 1)) : 1 - x * x * (3 - 2 * x);
    },
    Valley: function(x) {
        return -TERRAIN.Terrain.Influences.Hill(x);
    },
    Dome: function(x) {
        // Parabola
        return -(x + 1) * (x - 1);
    },
    // Not meaningful in Additive or Subtractive mode
    Flat: function(x) {
        return 0;
    },
    Volcano: function(x) {
        return 0.94 - 0.32 * (Math.abs(2 * x) + Math.cos(2 * Math.PI * Math.abs(x) + 0.4));
    },
};

/**
 * Place a geographic feature on the terrain.
 *
 * @param {TERRAIN.Vector3[]} g
 *   The vertex array for plane geometry to modify with heightmap data. This
 *   method sets the `z` property of each vertex.
 * @param {Object} options
 *   A map of settings that control how the terrain is constructed and
 *   displayed. Valid values are the same as those for the `options` parameter
 *   of {@link TERRAIN.Terrain}().
 * @param {Function} f
 *   A function describing the feature. The function should accept one
 *   parameter representing the distance from the feature's origin expressed as
 *   a number between -1 and 1 inclusive. Optionally it can accept a second and
 *   third parameter, which are the x- and y- distances from the feature's
 *   origin, respectively. It should return a number between -1 and 1
 *   representing the height of the feature at the given coordinate.
 *   `TERRAIN.Terrain.Influences` contains some useful functions for this
 *   purpose.
 * @param {Number} [x=0.5]
 *   How far across the terrain the feature should be placed on the X-axis, in
 *   PERCENT (as a decimal) of the size of the terrain on that axis.
 * @param {Number} [y=0.5]
 *   How far across the terrain the feature should be placed on the Y-axis, in
 *   PERCENT (as a decimal) of the size of the terrain on that axis.
 * @param {Number} [r=64]
 *   The radius of the feature.
 * @param {Number} [h=64]
 *   The height of the feature.
 * @param {String} [t=TERRAIN.NormalBlending]
 *   Determines how to layer the feature on top of the existing terrain. Valid
 *   values include `TERRAIN.AdditiveBlending`, `TERRAIN.SubtractiveBlending`,
 *   `TERRAIN.MultiplyBlending`, `TERRAIN.NoBlending`, `TERRAIN.NormalBlending`, and
 *   any function that takes the terrain's current height, the feature's
 *   displacement at a vertex, and the vertex's distance from the feature
 *   origin, and returns the new height for that vertex. (If a custom function
 *   is passed, it can take optional fourth and fifth parameters, which are the
 *   x- and y-distances from the feature's origin, respectively.)
 * @param {Number/Function} [e=TERRAIN.Terrain.EaseIn]
 *   A function that determines the "falloff" of the feature, i.e. how quickly
 *   the terrain will get close to its height before the feature was applied as
 *   the distance increases from the feature's location. It does this by
 *   interpolating the height of each vertex along a curve. Valid values
 *   include `TERRAIN.Terrain.Linear`, `TERRAIN.Terrain.EaseIn`,
 *   `TERRAIN.Terrain.EaseOut`, `TERRAIN.Terrain.EaseInOut`,
 *   `TERRAIN.Terrain.InEaseOut`, and any custom function that accepts a float
 *   between 0 and 1 representing the distance to the feature origin and
 *   returns a float between 0 and 1 with the adjusted distance. (Custom
 *   functions can also accept optional second and third parameters, which are
 *   the x- and y-distances to the feature origin, respectively.)
 */
TERRAIN.Terrain.Influence = function(g, options, f, x, y, r, h, t, e) {
    console.log('TERRAIN.Terrain.Influence');
    f = f || TERRAIN.Terrain.Influences.Hill; // feature shape
    x = typeof x === 'undefined' ? 0.5 : x; // x-location %
    y = typeof y === 'undefined' ? 0.5 : y; // y-location %
    r = typeof r === 'undefined' ? 64 : r; // radius
    h = typeof h === 'undefined' ? 64 : h; // height
    t = typeof t === 'undefined' ? TERRAIN.NormalBlending : t; // blending
    e = e || TERRAIN.Terrain.EaseIn; // falloff
    // Find the vertex location of the feature origin
    var xl = options.xSegments + 1, // # x-vertices
        yl = options.ySegments + 1, // # y-vertices
        vx = xl * x, // vertex x-location
        vy = yl * y, // vertex y-location
        xw = options.xSize / options.xSegments, // width of x-segments
        yw = options.ySize / options.ySegments, // width of y-segments
        rx = r / xw, // radius of the feature in vertices on the x-axis
        ry = r / yw, // radius of the feature in vertices on the y-axis
        r1 = 1 / r, // for speed
        xs = Math.ceil(vx - rx), // starting x-vertex index
        xe = Math.floor(vx + rx), // ending x-vertex index
        ys = Math.ceil(vy - ry), // starting y-vertex index
        ye = Math.floor(vy + ry); // ending y-vertex index
    // Walk over the vertices within radius of origin
    for (var i = xs; i < xe; i++) {
        for (var j = ys; j < ye; j++) {
            var k = j * xl + i,
                // distance to the feature origin
                fdx = (i - vx) * xw,
                fdy = (j - vy) * yw,
                fd = Math.sqrt(fdx * fdx + fdy * fdy),
                fdr = fd * r1,
                fdxr = fdx * r1,
                fdyr = fdy * r1,
                // Get the displacement according to f, multiply it by h,
                // interpolate using e, then blend according to t.
                d = f(fdr, fdxr, fdyr) * h * (1 - e(fdr, fdxr, fdyr));
            if (fd > r || typeof g[k] == 'undefined') continue;
            if (t === TERRAIN.AdditiveBlending) g[k].z += d; // jscs:ignore requireSpaceAfterKeywords
            else if (t === TERRAIN.SubtractiveBlending) g[k].z -= d;
            else if (t === TERRAIN.MultiplyBlending) g[k].z *= d;
            else if (t === TERRAIN.NoBlending) g[k].z = d;
            else if (t === TERRAIN.NormalBlending) g[k].z = e(fdr, fdxr, fdyr) * g[k].z + d;
            else if (typeof t === 'function') g[k].z = t(g[k].z, d, fdr, fdxr, fdyr);
        }
    }
};

export default TERRAIN.Terrain