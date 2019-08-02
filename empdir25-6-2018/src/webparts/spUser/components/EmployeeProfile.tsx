import * as React from 'react';
import styles from './SpUser.module.scss';
import { SPUser } from './spuser';
import { IUserProfileProps } from './ISpUserProps';




export interface IUserProfileState {

}



export  class EmployeeProfile extends React.Component<IUserProfileProps, IUserProfileState> {



  constructor(props?: IUserProfileProps, state?: IUserProfileState) {
    super(props);
   
  }

  public componentDidMount(): void {

  }

  

  public render(): React.ReactElement<IUserProfileProps> {
    

    return (
      <div className={styles.spUser}>
        
      </div>
    );
  }


}
