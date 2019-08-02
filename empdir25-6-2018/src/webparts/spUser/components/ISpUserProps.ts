import { IWebPartContext } from '@microsoft/sp-webpart-base';
import { SPUserService } from "../Services/SPUserService";
import { DirectoryService } from "../../../../lib/webparts/spUser/Services/DirectoryService";
import { SPUser } from './spuser';
import { PersonaModel } from '../Interfaces/SPUserPersonaModel';
import {  } from '../../../../node_modules/@types/history/index';



export interface ISpUserProps {
  description: string;
  context: IWebPartContext;
  spUserService?: SPUserService;
  directoryService?: DirectoryService;
  UserProps:IuserProperties;
  onConfigureButtonClicked:boolean;
  LicenceKey?:any;
  onConfigurationsUpdate:(property:any,propertyPath: any)=>void;
}
export interface IuserProperties
{
  AlphabetBackgroundColor:string
  AlphabetTextColor : string,
  Name:string,
  NodeBackgroundColor:string,
  NodeTextColor : string,
  ShowAlphabets :string,
  ShowRoundedCorners:string,
  ShowRoundedImage:string,
  ThemeType:string,
  Title:string,
  ViewType:string,
  quaternaryText:string,
  quinaryText:string,
  secondaryText:string,
  secondaryTextForCard:string,
  teritaryTextForCard:string,
  tertiaryText :string
}

export interface IUserProfileProps {
   User:SPUser;
}
export interface LicenceAppInfoProps
{
  LicenceKey?:any;
  onConfigurationsUpdate:(property:any,propertyPath: any)=>void;
}

export interface IUserCardViewProps {
  userPersona:any;
  UserProps:any;
  IsRoundedCornersEnabled?:boolean;
  DefaultTheme?:string;
  NodeBackgroundColor?:string;
  colorPickerValueForText?:string,
  IsRoundedImage?:boolean;
  
  
}

export interface INodeConfigurationComponentSProps {
  context: IWebPartContext;
  getPersonaList?: (data : SPUser[]) => PersonaModel[];
  onClosePanel?: () => void;
  getUserPropertiesData:()=>void;
  RenderNavComponent:(componentName:string)=>void;
  UserProps:any;
  loggedUser:any;
  DynamicUserProperties:string[];
  onConfigurationsUpdate:(property:any,propertyPath: any)=>void;

}

export interface IGeneralConfigurationComponentSProps {
  RenderNavComponent:(componentName:string)=>void;
  context: IWebPartContext;
  loggedUser:any;
  UserProps:any;
  onClosePanel?: () => void;
  onConfigurationsUpdate:(property:any,propertyPath: any)=>void;
}


export interface IConfigurationsComponentProps {
  context: IWebPartContext;
  getPersonaList?: (data : SPUser[]) => PersonaModel[];
  onClosePanel?: () => void;
  getUserPropertiesData:()=>void;
  UserProps:any;
  DynamicUserProperties:string[];
  loggedUser:any;
  onConfigurationsUpdate:(property:any,propertyPath: any)=>void;

}

