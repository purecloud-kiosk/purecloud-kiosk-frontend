import React, {Component} from 'react';
import i18next from 'i18next';
export default class CheckInTable extends Component{
  constructor(props){
    super(props);
    this.state = {
      'checkIns' : this.props.checkIns
    }
  }
  componentWillReceiveProps(newProps){
    this.state.checkIns = newProps.checkIns;
    this.setState(this.state);
  }
  shouldComponentUpdate(newProps){
    if(this.state.checkIns !== null)
      return this.state.checkIns.length !== newProps.checkIns.length;
    else
      return true;
  }
  render(){
    console.log('about to render table');
    const {checkIns} = this.state;
    let rows = [], table;
    if(checkIns === null || checkIns.length ===  0){
       table = (
        <div className='text-center'>
          <h5>{i18next.t('NO_CHECKINS')}</h5>
        </div>
      );
    }
    else{
      for(let i = checkIns.length -1 ; i >= 0 ; i--){
        let image = checkIns[i].image;
        if(image === null) {
          image = 'img/avatar.jpg';
        }
        rows.push(
            <tr className='animated fadeInLeft' key={checkIns[i].personID}>
              <td><img width='30px' height='30px' src={image}/></td>
              <td>{checkIns[i].name}</td>
              <td>{moment(checkIns[i].timestamp).format('LLL')}</td>
            </tr>
        );
      }

     table = (
       <table className='table table-hover'>
         <thead>
           <tr>
             <th>{i18next.t('IMAGE')}</th>
             <th>{i18next.t('NAME')}</th>
             <th>{i18next.t('DATE_CHECKED_IN')}</th>
           </tr>
         </thead>
         <tbody>
           {rows}
         </tbody>
       </table>
     )
    };
    return table;
  }
}
