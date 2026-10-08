import { Wheat } from 'lucide-react';
import { APP_NAME } from '../config/app';
import { FlagMark } from './Brand';

export function LoadingScreen() {
  return (
    <div className="screen center loading" role="status" aria-live="polite">
      <div className="logo"><FlagMark size={36} /><h1>{APP_NAME}</h1></div>
      <p>Loading your community...</p>
      <Wheat size={44} className="sway" aria-hidden />
      <div className="bar"><span className="fill" /></div>
    </div>
  );
}
