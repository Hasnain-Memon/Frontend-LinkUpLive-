import React from 'react';
function Button(_a) {
    var children = _a.children, className = _a.className, type = _a.type;
    return (<button type={type} className={"bg-blue-600 text-gray-100 px-4 py-3 rounded-md font-semibold ".concat(className)}>{children}</button>);
}
export default Button;
