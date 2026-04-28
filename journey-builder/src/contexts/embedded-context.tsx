/**
 * Signals that the Journey Builder is running embedded inside a parent app.
 * Defaults to false so the standalone app is unaffected.
 */
import { createContext, useContext } from 'react';

export const EmbeddedContext = createContext(false);

export const useEmbedded = () => useContext(EmbeddedContext);
