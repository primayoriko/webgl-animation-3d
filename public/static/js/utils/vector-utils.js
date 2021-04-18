const vector = {
    multiply: (
        x1, y1, z1,
        x2, y2, z2,
    ) => {
        return {
            x: y1 * z2 - y2 * z1,
            y: z1 * x2 - z2 * x1,
            z: x1 * y2 - x2 * y1
        };
    },
    subtract: (
        x1, y1, z1,
        x2, y2, z2,
    ) => {
        return {
            x: x1-x2,
            y: y1-y2,
            z: z1-z2
        };
    },
    normal: (
        x1, y1, z1,
        x2, y2, z2,
        x3, y3, z3,
    ) => {
        const vec1 = {
            x: x2 - x1,
            y: y2 - y1,
            z: z2 - z1
        }
    
        const vec2 = {
            x: x3 - x2,
            y: y3 - y2,
            z: z3 - z2
        }

        const vec3 = vector.multiply(
            vec1.x, vec1.y, vec1.z, 
            vec2.x, vec2.y, vec2.z
        );

        const length = Math.sqrt(
                Math.pow(vec3.x, 2) + 
                Math.pow(vec3.y, 2) + 
                Math.pow(vec3.z, 2) 
            );

        return {
            x: vec3.x/length,
            y: vec3.y/length,
            z: vec3.z/length,
        } 
    }
}

export default vector;