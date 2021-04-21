const colors = [
   'red','green','purple','black','white','pink','gold'
]
const fontWeight = [
    {
        name: 'bold',
        class: 'bold'
    },
    {
        name: 'light',
        class: 'light'
    },
]

fontSizes =[]
for (let i = 10; i < 40; i++){fontSizes.push(i)}

fontSizes.forEach(size => {
    document.getElementById('text-size').innerHTML += `<option value="${size}px">${size}</option>`;
})

colors.forEach(color => {
    document.getElementById('text-color').innerHTML += `<option value="${color}">${color}</option>`;
});

fontWeight.forEach(font => {
    document.getElementById('text-font').innerHTML += `<option value="${font.class}">${font.name}</option>`;
});




