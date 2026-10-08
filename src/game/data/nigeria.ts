import type { NigerianState } from '../../types/nigeria';

const rows: Array<[string, string, string, string, string, string, string, string, string[]]> = [
  ['abia','Abia','South East','Umuahia','cocoa, cassava','palm oil, livestock','processing hubs','flood exposure',['Aba','Umuahia South']],
  ['adamawa','Adamawa','North East','Yola','maize, rice','livestock, fisheries','irrigation and livestock','dry-season water stress',['Yola South','Mubi North']],
  ['akwa-ibom','Akwa Ibom','South South','Uyo','oil palm, fisheries','cassava, vegetables','coastal trade','flood exposure',['Uyo','Ikot Ekpene']],
  ['anambra','Anambra','South East','Awka','rice, vegetables','yam, cassava','commerce and processing','urban transport pressure',['Awka South','Onitsha South']],
  ['bauchi','Bauchi','North East','Bauchi','maize, livestock','rice, groundnut','irrigation and food storage','dry-season water stress',['Bauchi','Azare']],
  ['bayelsa','Bayelsa','South South','Yenagoa','fisheries, oil palm','rice, cassava','fisheries and waterways','flood exposure',['Yenagoa','Brass']],
  ['benue','Benue','North Central','Makurdi','yam, cassava','rice, soybeans','crop processing','flood exposure',['Makurdi','Gboko']],
  ['borno','Borno','North East','Maiduguri','livestock, grains','fisheries, vegetables','water-efficient agriculture','dry-season water stress',['Maiduguri','Biu']],
  ['cross-river','Cross River','South South','Calabar','cocoa, oil palm','rice, fisheries','cocoa and eco-trade','flood exposure',['Calabar Municipal','Ikom']],
  ['delta','Delta','South South','Asaba','oil palm, fisheries','cassava, rice','river transport and processing','flood exposure',['Oshimili South','Warri South']],
  ['ebonyi','Ebonyi','South East','Abakaliki','rice, cassava','yam, vegetables','rice milling','seasonal flooding',['Abakaliki','Afikpo North']],
  ['edo','Edo','South South','Benin City','rubber, oil palm','cassava, cocoa','industrial agriculture','road maintenance pressure',['Oredo','Egor']],
  ['ekiti','Ekiti','South West','Ado-Ekiti','cocoa, cassava','rice, vegetables','high-value crop processing','hilly transport routes',['Ado Ekiti','Ikere']],
  ['enugu','Enugu','South East','Enugu','cassava, vegetables','rice, palm oil','urban food markets','limited farmland near cities',['Enugu North','Nsukka']],
  ['gombe','Gombe','North East','Gombe','maize, groundnut','livestock, rice','dryland processing','dry-season water stress',['Gombe','Kaltungo']],
  ['imo','Imo','South East','Owerri','oil palm, cassava','yam, vegetables','palm processing','flood and erosion risk',['Owerri Municipal','Orlu']],
  ['jigawa','Jigawa','North West','Dutse','rice, grains','groundnut, livestock','irrigated farming','dry-season water stress',['Dutse','Hadejia']],
  ['kaduna','Kaduna','North West','Kaduna','maize, ginger','soybeans, livestock','agro-processing','transport distance',['Kaduna North','Zaria']],
  ['kano','Kano','North West','Kano','grains, livestock','tomatoes, onions','large food markets','water pressure',['Kano Municipal','Dambatta']],
  ['katsina','Katsina','North West','Katsina','grains, livestock','cotton, vegetables','dryland commerce','dry-season water stress',['Katsina','Funtua']],
  ['kebbi','Kebbi','North West','Birnin Kebbi','rice, fisheries','grains, livestock','rice processing','flood exposure',['Birnin Kebbi','Argungu']],
  ['kogi','Kogi','North Central','Lokoja','cassava, rice','yam, cashew','river trade','flood exposure',['Lokoja','Okene']],
  ['kwara','Kwara','North Central','Ilorin','cassava, rice','shea, livestock','regional food logistics','seasonal water stress',['Ilorin West','Offa']],
  ['lagos','Lagos','South West','Ikeja','fisheries, vegetables','poultry, cassava','commerce and cold-chain food','limited farmland',['Ikeja','Ikorodu']],
  ['nasarawa','Nasarawa','North Central','Lafia','yam, cassava','rice, sesame','processing and storage','road access challenges',['Lafia','Keffi']],
  ['niger','Niger','North Central','Minna','rice, maize','yam, livestock','large-scale agriculture','flood and dry-season variation',['Minna','Bida']],
  ['ogun','Ogun','South West','Abeokuta','cassava, maize','poultry, cocoa','industrial and food processing','urban expansion pressure',['Odo-Ewa LGA','Abeokuta South','Ifo']],
  ['ondo','Ondo','South West','Akure','cocoa, oil palm','cassava, fisheries','cocoa processing','coastal flooding',['Akure South','Ondo West']],
  ['osun','Osun','South West','Osogbo','cocoa, cassava','rice, vegetables','food processing','erosion and road maintenance',['Osogbo','Ife East']],
  ['oyo','Oyo','South West','Ibadan','cassava, maize','cocoa, livestock','large agricultural markets','urban-rural transport pressure',['Ibadan North','Ogbomosho North']],
  ['plateau','Plateau','North Central','Jos','vegetables, potatoes','maize, livestock','cold-chain agriculture','hilly transport routes',['Jos North','Barkin Ladi']],
  ['rivers','Rivers','South South','Port Harcourt','fisheries, oil palm','cassava, vegetables','coastal trade and processing','flood exposure',['Port Harcourt City','Obio-Akpor']],
  ['sokoto','Sokoto','North West','Sokoto','grains, livestock','onion, vegetables','dryland irrigation','dry-season water stress',['Sokoto North','Wamakko']],
  ['taraba','Taraba','North East','Jalingo','tea, coffee','maize, rice','highland agriculture','long transport routes',['Jalingo','Wukari']],
  ['yobe','Yobe','North East','Damaturu','grains, livestock','gum arabic, vegetables','water-efficient agriculture','dry-season water stress',['Damaturu','Potiskum']],
  ['zamfara','Zamfara','North West','Gusau','grains, cotton','livestock, vegetables','agro-processing','dry-season water stress',['Gusau','Talata Mafara']],
  ['fct','Federal Capital Territory','Federal Capital Territory','Abuja','vegetables, livestock','maize, poultry','urban food supply','limited peri-urban farmland',['Abuja Municipal','Gwagwalada']],
];

export const nigeriaRegions: NigerianState[] = rows.map(([id, name, region, capital, primary, secondary, opportunity, challenge, lgas]) => ({
  id, name, region: region as NigerianState['region'], capital,
  agriculturalStrengths: primary.split(', '), secondaryStrengths: secondary.split(', '),
  opportunities: [opportunity], challenges: [challenge], lgas,
}));

export const nigerianStates = nigeriaRegions.filter((region) => region.id !== 'fct');
export const fct = nigeriaRegions.find((region) => region.id === 'fct')!;
export const regionById = (id: string) => nigeriaRegions.find((region) => region.id === id);
