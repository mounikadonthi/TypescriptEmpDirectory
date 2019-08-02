import * as React from 'react';
import { SPUser } from './spuser';
import { IUserCardViewProps } from './ISpUserProps';

import { Label } from 'office-ui-fabric-react/lib/Label';
import { IPersonaProps, Persona, PersonaSize, PersonaPresence } from "office-ui-fabric-react/lib/Persona";

import styles from './SpUser.module.scss';

export interface ITileProfileState {

}

export  class TileCardComponent extends React.Component<IUserCardViewProps, ITileProfileState> {

  constructor(props?: IUserCardViewProps, state?: ITileProfileState) {
    super(props);
  }

  public componentDidMount(): void {

  }

  public render(): React.ReactElement<IUserCardViewProps> {
  
    return (
     
      <div className={this.props.IsRoundedCornersEnabled==true?styles.employeeNodeTilecard+" "+styles.roundedCorner:styles.employeeNodeTilecard}  style={this.props.UserProps.length!=0 && this.props.DefaultTheme=="Custom"?{backgroundColor:this.props.NodeBackgroundColor,color:this.props.colorPickerValueForText}:{backgroundColor:"#e9e8e8",color:"black"}}>
    <img className={styles.employeeTileCardimage} src="https://www.relayinvestments.com/wp-content/uploads/2017/05/testi-pic-generic.jpg" alt="User" width="42" height="42" style={this.props.IsRoundedImage==true?{'borderRadius': '34px'}:{'borderRadius': '0px'}}/>
    <span className={styles.employeeTilecardSpan +" "+styles.employeeCardTitleText}>{this.props.userPersona.Name}</span>
    <span className={styles.employeeTilecardSpan}>{this.props.userPersona.secondaryText}</span>
    <span className={styles.employeeTilecardSpan}>{this.props.userPersona.tertiaryText}</span>
    <span className={styles.employeeTilecardSpan}>{this.props.userPersona.quaternaryText}</span>
          <span className={styles.employeeTilecardSpan}>{this.props.userPersona.quinaryText}</span>

    <div className={styles.employeeTileCardicons}>
                            <i className={"ms-Icon ms-Icon--AddPhone" +" "+styles.employeeicon} aria-hidden="true"></i> <span className={styles.employeeiconsafter}>| </span>
                            <i className={"ms-Icon ms-Icon--MailSolid"+" "+styles.employeeicon} aria-hidden="true"></i><span className={styles.employeeiconsafter}>| </span>
                            <i className={"ms-Icon ms-Icon--MessageFill"+" "+styles.employeeicon} aria-hidden="true"></i>
    </div>
 </div>
       
    );
  }



}
