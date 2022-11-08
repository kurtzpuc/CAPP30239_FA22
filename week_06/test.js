$("#chart1").ejChart({
    series: [{
        points: [{ x: 'Walmart', y: 13, text: '13%' },
            { x: 'Apple', y: 25, text: '25%' },
            { x: 'Best Buy', y: 12, text: '12%' },
            { x: 'Target', y: 7, text: '7%' },
            { x: 'Amazon', y: 10, text: '10%' },
            { x: 'Wenger', y: 13, text: '13%' },
            { x: 'Others', y: 20, text: '20%' }
        ],
        name: 'Newyork', type: 'pie', explode: true,
    }],
});
$("#chart").ejChart({
    series: [{
        points: [{ x: 1980, y: 11 }, { x: 1984, y: 13 },
            { x: 1988, y: 16 }, { x: 1992, y: 17 }, { x: 1996, y: 17 }, { x: 2000, y: 18 }, { x: 2004, y: 20 },
                { x: 2008, y: 22 }, { x: 2012, y: 24 }],
        name: 'India', type: "column"
    }],
});