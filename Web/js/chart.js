const data = {
    labels: [
      'OK',
      'NG'
    ],
    datasets: [{
      label: 'NG/OK',
      data: [0, 0],
      backgroundColor: [
        'rgb(172, 209, 44)',
        'rgb(229, 66, 26)'
      ],
      hoverOffset: 4
    }]
  };

  const config = {
    type: 'pie',
    data: data,
  };

  // === include 'setup' then 'config' above ===

  const chart = new Chart(
    document.getElementById('myChart'),
    config
  );

function updateChart(ok, ng){
    chart.data.datasets[0].data = [ok, ng]
    chart.update()    
}


