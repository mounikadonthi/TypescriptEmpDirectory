import * as React from 'react';
import { SPUser } from './spuser';
import { IUserCardViewProps } from './ISpUserProps';

import { Label } from 'office-ui-fabric-react/lib/Label';
import { IPersonaProps, Persona, PersonaSize, PersonaPresence } from "office-ui-fabric-react/lib/Persona";

import styles from './SpUser.module.scss';

export interface IUserProfileState {

}

export  class CardComponent extends React.Component<IUserCardViewProps, IUserProfileState> {

  constructor(props?: IUserCardViewProps, state?: IUserProfileState) {
    super(props);
  }

  public componentDidMount(): void {

  } 

  public render(): React.ReactElement<IUserCardViewProps> {
    console.log("asdas",this.props.userPersona)
    return  ( <div  className={this.props.IsRoundedCornersEnabled==true?styles.employeecard+" "+styles.roundedCorner:styles.employeecard} style={this.props.UserProps && this.props.DefaultTheme=="Custom"?{backgroundColor: this.props.NodeBackgroundColor,color:this.props.colorPickerValueForText}:{backgroundColor:"#e9e8e8",color:"black"}}>
    <img className={styles.employeeCardimage} src="https://www.relayinvestments.com/wp-content/uploads/2017/05/testi-pic-generic.jpg" alt="User" width="42" height="42" style={this.props.IsRoundedImage==true?{'borderRadius':'34px'}:{'borderRadius':'0px'}}/>
       <span className={styles.employeecardSpan+" "+styles.employeeCardTitleText}>{this.props.userPersona.Name}</span>
       <span className={styles.employeecardSpan}>{this.props.userPersona.secondaryTextForCard}</span>
       <span className={styles.employeecardSpan}>{this.props.userPersona.teritaryTextForCard}</span>
   
   <div className={styles.employeecardicons}>
                           <i className={"ms-Icon ms-Icon--AddPhone"+" "+styles.employeeicon} aria-hidden="true"></i> <span className={styles.employeeiconsafter}>| </span>
                           <i className={"ms-Icon ms-Icon--MailSolid"+" "+styles.employeeicon} aria-hidden="true"></i><span className={styles.employeeiconsafter}>| </span>
                           <i className={"ms-Icon ms-Icon--MessageFill"+" "+styles.employeeicon} aria-hidden="true"></i>
                     </div>
                     </div>
                     
    );
  }


}
