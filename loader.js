const ModelLoader = (() => {

    const loader = new THREE.GLTFLoader();
    const cache = {};

    function load(path, onSuccess, onError) {

        if (cache[path]) {
            onSuccess(cache[path].scene.clone(true), cache[path].animations || []);
            return;
        }

        loader.load(
            path,

            gltf => {

                cache[path] = {
                    scene: gltf.scene,
                    animations: gltf.animations || []
                };

                const object = gltf.scene.clone(true);

                onSuccess(object, gltf.animations || []);
            },

            undefined,

            error => {

                console.warn("Không tải được model:", path);

                if (onError) {
                    onError(error);
                }
            }
        );
    }

    function fallbackCube(material = null) {

        const geometry = new THREE.BoxGeometry(1, 1, 1);

        const mat = material ||
            new THREE.MeshStandardMaterial({
                color: 0x777777
            });

        return new THREE.Mesh(geometry, mat);
    }

    return {
        load,
        fallbackCube
    };

})();