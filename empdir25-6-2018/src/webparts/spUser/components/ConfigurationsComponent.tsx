import * as React from 'react';
import { SPUser } from './spuser';
import { IConfigurationsComponentProps } from './ISpUserProps';

import { DefaultButton,PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { Icon } from 'office-ui-fabric-react/lib/Icon';

import {NodeConfigurationComponent} from './NodeConfigurationComponent';
import {GeneralConfigurationComponent} from './GeneralConfigurationComponent';

import styles from './SpUser.module.scss';

export interface IConfigurationsComponentState {
  showPanel:boolean;
  ComponentRendered:string;
}

export  class ConfigurationsComponent extends React.Component<IConfigurationsComponentProps, IConfigurationsComponentState> {

  constructor(props?: IConfigurationsComponentProps, state?: IConfigurationsComponentState) {
    super(props);
    this.state={
      showPanel:true,
      ComponentRendered:"General"
    }
    this.RenderNavComponent = this.RenderNavComponent.bind(this);
  }

  public componentDidMount(): void {

  }

  private onShowPanel = (): void => {
    this.setState({ showPanel: true });
  };
  
  private onClosePanel = (): void => {
    this.setState({ showPanel: false,
     });
  };

  public RenderNavComponent=(componentName:string):void=>
  {
    this.setState({ ComponentRendered: componentName,
    });
  }

  private onRenderFooterContent = (): JSX.Element => {
    return (
      <div>
        <DefaultButton onClick={this.props.onClosePanel}>Cancel</DefaultButton>
      </div>
    );
  };

  public render(): React.ReactElement<IConfigurationsComponentProps> {
    return (
        <div className="ms-Grid">
           <Panel
                isOpen={this.state.showPanel}
                onDismiss={this.props.onClosePanel}
                isBlocking={true}
                type={PanelType.large}
                className={styles.ConfigurationsPanel}
              >
          <div className={"ms-Grid-row" }>
              <div className={styles.configurationsNavigation + " ms-Grid-col ms-u-sm3 "  }  > 
                <h2 className={styles.confugarationsNavigationHeader}>Configurations</h2>
                <div className={styles.configurationNavElements}>
                <div className={styles.pointerCursor+" "+styles.confugarationsNavigationElement} style={this.state.ComponentRendered== "General"?{backgroundColor:"#333",color:"#a6a6a6"}:{backgroundColor:"#000",color:"#fff"}} onClick={()=>this.RenderNavComponent("General")}><span className={styles.employeeCardTitleText}>General</span><div className={styles.NavigationElementDiv}><span>Contains General Configurations</span><Icon  iconName="ChevronRightSmall" className={styles.configurationCancelButton +" " +styles.pointerCursor} /></div></div>
                  <div className={styles.pointerCursor+" "+styles.confugarationsNavigationElement} style={this.state.ComponentRendered== "Node"?{backgroundColor:"#333",color:"#a6a6a6"}:{backgroundColor:"#000",color:"#fff"}} onClick={()=>this.RenderNavComponent("Node")}><span className={styles.employeeCardTitleText}>Node</span><div className={styles.NavigationElementDiv}><span>Contains Node Configurations</span><Icon  iconName="ChevronRightSmall" className={styles.configurationCancelButton +" " +styles.pointerCursor} /></div></div>
                  <div className={styles.pointerCursor+" "+styles.confugarationsNavigationElement}><span className={styles.employeeCardTitleText}>Template</span><div className={styles.NavigationElementDiv}><span >Contains Template Configurations</span><Icon  iconName="ChevronRightSmall" className={styles.configurationCancelButton +" " +styles.pointerCursor} /></div></div>
                  <div className={styles.pointerCursor+" "+styles.confugarationsNavigationElement}><span className={styles.employeeCardTitleText}>Exclude Filters</span><div className={styles.NavigationElementDiv}><span>Contains Filters Configurations</span><Icon  iconName="ChevronRightSmall" className={styles.configurationCancelButton +" " +styles.pointerCursor} /></div></div>
                </div>
            </div>
            <div className={"ms-Grid-col ms-u-sm9"+" "+styles.navigationContent}>
           { this.state.ComponentRendered=="Node"&&<NodeConfigurationComponent context={this.props.context} onConfigurationsUpdate={this.props.onConfigurationsUpdate} getPersonaList ={this.props.getPersonaList} onClosePanel={this.onClosePanel} RenderNavComponent={this.RenderNavComponent} getUserPropertiesData={this.props.getUserPropertiesData} UserProps={this.props.UserProps} DynamicUserProperties={this.props.DynamicUserProperties} loggedUser={this.props.loggedUser}/>}
           { this.state.ComponentRendered=="General"&&<GeneralConfigurationComponent  context={this.props.context} onConfigurationsUpdate={this.props.onConfigurationsUpdate} loggedUser={this.props.loggedUser} onClosePanel={this.onClosePanel} RenderNavComponent={this.RenderNavComponent} UserProps={this.props.UserProps}/>}
        </div>

     </div>
            </Panel>
     
   </div>
    );
  }


}
