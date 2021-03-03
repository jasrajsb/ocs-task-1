const element = document.querySelector('form');
element.addEventListener('submit', event => {
  event.preventDefault();
  if(org===''){

  }

  document.getElementById('repos').innerHTML='';
  var org = document.getElementById('org').value;
  var m = document.getElementById('m').value;
  var n = document.getElementById('n').value;
  if(org===''){
    ////console.log('ye');
    invalidOrg();
     document.getElementById('org').parentElement.classList.add('invalid');
  } else{
    $('#exampleModalCenter').modal('show');
    document.getElementById('orgval').innerHTML = '@'+org;
    document.getElementById('orgval').setAttribute('href', 'https://github.com/'+org);
    var pmax=((n>100)?(Math.floor(n/100)+1):'1');
    var getpage=(i)=>{
      if(i<=pmax){
        fetch('https://api.github.com/search/repositories?q=user:'+org+'&sort=forks&per_page='+((n>100?100:n)+'')+'&page='+i).then((res)=>{
          return res.json()

        }).then((data)=>{
          ////console.log('hello');

          var arr = [];
          var promises = [];
          if(i===pmax){
            data.items.length=n%100;
          }
          data.items.forEach((item, i) => {
            var obj={
              name: item.name,
              forks: item.forks_count,
              desc:item.description||'',
              url:item.html_url
            };
            ////console.log(item.description);
            arr.push(obj);
            document.getElementById('repos').innerHTML+='<div class="repo"> <img src="./repo-logo.svg" class="inline-img" alt=""> <a href=# class="gh">'+org+'</a>/<a href=# class="gh">'+obj.name+'</a> <div class="label"> '+obj.forks+' Forks </div><br> <small class="desc">'+obj.desc+'</small><br><br> <div class="mini-button"> <button data-toggle="modal" onclick="getContributors(\''+obj.name+'\',\''+org+'\',\''+m+'\')" data-target="#exampleModalCenter" type="button" name="button">Contributors</button> </div> </div>';
          });
          ////console.log(arr);
          $('#formPage').hide();
          $('#resultsPage').show();
          getpage(i+1);
          setInterval(()=>{
            $('#exampleModalCenter').modal('hide');
          },500)
        }).catch(()=>{
          invalidOrg();
        });
      }
    }
    getpage(1);
  }
});


var invalidOrg = ()=>{
   document.getElementById('org').addEventListener('keyup', ((e)=>{

     if(e.target.value==''){
       //////console.log('ye1');
       document.getElementById('org').parentElement.classList.add('invalid');
     } else{
       ////console.log('ye2', e.target.value);
       document.getElementById('org').parentElement.classList.remove('invalid');
     }
   }))
}

var getContributors =(name, org, m)=>{
  document.getElementById('loading').style.display='block';
  document.getElementById('data').style.display='none';
  fetch('https://api.github.com/repos/'+org+'/'+name+'/contributors?per_page='+(m>100?100:m)+'&page='+(m>100?(Math.floor(m/100)+1):1)).then((resd)=>{
    document.getElementById('loading').style.display='none';
    document.getElementById('data').style.display='block';
    return resd.json();
  }).then((datad)=>{
    ////console.log(datad);
    elem = document.getElementById('data');
    elem.innerHTML = '';
    datad.forEach((item, i) => {
      elem.innerHTML+='<div>'+(i+1).toString()+'. <strong>'+item.login+'</strong>: '+item.contributions+' '+'</div>'
    });

  });
}

const add=(id)=>{
  document.getElementById(id).value-=0;
  document.getElementById(id).value++;
}
const sub=(id)=>{
  document.getElementById(id).value-=1;

}
