import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,PropertyPaneButton,PropertyPaneButtonType
} from '@microsoft/sp-webpart-base';

import * as strings from 'SpUserWebPartStrings';
import SpUserDetails from './components/SpUserDetails';
import { ISpUserProps } from './components/ISpUserProps';
import {IuserProperties} from './components/ISpUserProps'
import { SPUserService } from './Services/SPUserService';
import { DirectoryService } from './Services/DirectoryService';
import { IWebPartContext } from '@microsoft/sp-webpart-base';
import { SPHttpClient } from '@microsoft/sp-http';
import { update, get } from '@microsoft/sp-lodash-subset';

export interface ISpUserWebPartProps {
  description: string;
  context: IWebPartContext;
  UserProps:IuserProperties;
  onConfigureButtonClicked:boolean;
  LicenceKey:any;
}

export default class SpUserWebPart extends BaseClientSideWebPart<ISpUserWebPartProps> {

  public onConfigurationsUpdate(property:any,propertyPath: any): void {
    const oldValue: any = get(this.properties, property);
    // store new value in web part properties
    update(this.properties, property, (): any => { return propertyPath; });
    // refresh web part
    this.render();
  }
  OnConfigure()
  {
    this.properties.onConfigureButtonClicked=true;
     //return <Listitems/>
  }


  public render(): void {
    console.log("ad",this.properties.LicenceKey)
    const element: React.ReactElement<ISpUserProps> = React.createElement(
     
      SpUserDetails,
      {
        description: this.properties.description,
        context: this.context,
        spUserService: new SPUserService(this.context),
        directoryService: new DirectoryService(),
        UserProps:this.properties.UserProps,
        onConfigurationsUpdate:this.onConfigurationsUpdate.bind(this),
        onConfigureButtonClicked:this.properties.onConfigureButtonClicked,
        LicenceKey:this.properties.LicenceKey
      }
    );

    ReactDom.render(element,this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: "Click to Configure Employee Directory"
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneButton('ClickHere',  
                {  
                 text: "Configure",  
                 buttonType: PropertyPaneButtonType.Normal,  
                 onClick: this.OnConfigure.bind(this),
                }),  
              ]
            }
          ]
        }
      ]
    };
  }
}
