import { useState, useEffect } from 'react';
import { supabase, EVENTO_ID } from './supabase';

const DASHBOARD_PIN = 'mibodamc2026';

type RsvpRow = {
  id: string;
  nombre: string;
  asiste: boolean;
  created_at: string;
  evento_id: string;
};

type Guest = { nombre: string; tel: string; url: string; wa: string };

const GUESTS: Guest[] = [
  { nombre: 'Papi e Isa', tel: '573148905070', url: 'https://boda-maria-juanca.celebrarte.com.co/papi-e-isa', wa: 'https://wa.me/573148905070?text=https://boda-maria-juanca.celebrarte.com.co/papi-e-isa' },
  { nombre: 'Papi e Isa', tel: '573173834417', url: 'https://boda-maria-juanca.celebrarte.com.co/papi-e-isa', wa: 'https://wa.me/573173834417?text=https://boda-maria-juanca.celebrarte.com.co/papi-e-isa' },
  { nombre: 'Olguister', tel: '573148905077', url: 'https://boda-maria-juanca.celebrarte.com.co/olguister', wa: 'https://wa.me/573148905077?text=https://boda-maria-juanca.celebrarte.com.co/olguister' },
  { nombre: 'Gregs & Caro', tel: '573136720372', url: 'https://boda-maria-juanca.celebrarte.com.co/gregs-y-caro', wa: 'https://wa.me/573136720372?text=https://boda-maria-juanca.celebrarte.com.co/gregs-y-caro' },
  { nombre: 'Gregs & Caro', tel: '573152418682', url: 'https://boda-maria-juanca.celebrarte.com.co/gregs-y-caro', wa: 'https://wa.me/573152418682?text=https://boda-maria-juanca.celebrarte.com.co/gregs-y-caro' },
  { nombre: 'Malía & Rod', tel: '573148905076', url: 'https://boda-maria-juanca.celebrarte.com.co/malia-y-rod', wa: 'https://wa.me/573148905076?text=https://boda-maria-juanca.celebrarte.com.co/malia-y-rod' },
  { nombre: 'Malía & Rod', tel: '573105792347', url: 'https://boda-maria-juanca.celebrarte.com.co/malia-y-rod', wa: 'https://wa.me/573105792347?text=https://boda-maria-juanca.celebrarte.com.co/malia-y-rod' },
  { nombre: 'Jara & Angelita', tel: '573148905074', url: 'https://boda-maria-juanca.celebrarte.com.co/jara-y-angelita', wa: 'https://wa.me/573148905074?text=https://boda-maria-juanca.celebrarte.com.co/jara-y-angelita' },
  { nombre: 'Jara & Angelita', tel: '573206989561', url: 'https://boda-maria-juanca.celebrarte.com.co/jara-y-angelita', wa: 'https://wa.me/573206989561?text=https://boda-maria-juanca.celebrarte.com.co/jara-y-angelita' },
  { nombre: 'Andrés & Anny', tel: '573164118926', url: 'https://boda-maria-juanca.celebrarte.com.co/andres-y-anny', wa: 'https://wa.me/573164118926?text=https://boda-maria-juanca.celebrarte.com.co/andres-y-anny' },
  { nombre: 'Andrés & Anny', tel: '573214804600', url: 'https://boda-maria-juanca.celebrarte.com.co/andres-y-anny', wa: 'https://wa.me/573214804600?text=https://boda-maria-juanca.celebrarte.com.co/andres-y-anny' },
  { nombre: 'Juan Jaramillo', tel: '971521027836', url: 'https://boda-maria-juanca.celebrarte.com.co/juan-jaramillo', wa: 'https://wa.me/971521027836?text=https://boda-maria-juanca.celebrarte.com.co/juan-jaramillo' },
  { nombre: 'Martica', tel: '573218034247', url: 'https://boda-maria-juanca.celebrarte.com.co/martica', wa: 'https://wa.me/573218034247?text=https://boda-maria-juanca.celebrarte.com.co/martica' },
  { nombre: 'Rafa & Olga', tel: '573134542240', url: 'https://boda-maria-juanca.celebrarte.com.co/rafa-y-olga', wa: 'https://wa.me/573134542240?text=https://boda-maria-juanca.celebrarte.com.co/rafa-y-olga' },
  { nombre: 'Rafa & Olga', tel: '573134539405', url: 'https://boda-maria-juanca.celebrarte.com.co/rafa-y-olga', wa: 'https://wa.me/573134539405?text=https://boda-maria-juanca.celebrarte.com.co/rafa-y-olga' },
  { nombre: 'Camilo & Laura', tel: '573134549081', url: 'https://boda-maria-juanca.celebrarte.com.co/camilo-y-laura', wa: 'https://wa.me/573134549081?text=https://boda-maria-juanca.celebrarte.com.co/camilo-y-laura' },
  { nombre: 'Juancho & Clara', tel: '573155097517', url: 'https://boda-maria-juanca.celebrarte.com.co/juancho-y-clara', wa: 'https://wa.me/573155097517?text=https://boda-maria-juanca.celebrarte.com.co/juancho-y-clara' },
  { nombre: 'Juancho & Clara', tel: '573155097606', url: 'https://boda-maria-juanca.celebrarte.com.co/juancho-y-clara', wa: 'https://wa.me/573155097606?text=https://boda-maria-juanca.celebrarte.com.co/juancho-y-clara' },
  { nombre: 'JuanMa & Ana', tel: '573163464862', url: 'https://boda-maria-juanca.celebrarte.com.co/juanma-y-ana', wa: 'https://wa.me/573163464862?text=https://boda-maria-juanca.celebrarte.com.co/juanma-y-ana' },
  { nombre: 'Daniel & Carolina', tel: '573176400680', url: 'https://boda-maria-juanca.celebrarte.com.co/daniel-y-carolina', wa: 'https://wa.me/573176400680?text=https://boda-maria-juanca.celebrarte.com.co/daniel-y-carolina' },
  { nombre: 'Daniel & Carolina', tel: '573148932859', url: 'https://boda-maria-juanca.celebrarte.com.co/daniel-y-carolina', wa: 'https://wa.me/573148932859?text=https://boda-maria-juanca.celebrarte.com.co/daniel-y-carolina' },
  { nombre: 'Steve & Chola', tel: '573187348669', url: 'https://boda-maria-juanca.celebrarte.com.co/steve-y-chola', wa: 'https://wa.me/573187348669?text=https://boda-maria-juanca.celebrarte.com.co/steve-y-chola' },
  { nombre: 'Steve & Chola', tel: '573002723082', url: 'https://boda-maria-juanca.celebrarte.com.co/steve-y-chola', wa: 'https://wa.me/573002723082?text=https://boda-maria-juanca.celebrarte.com.co/steve-y-chola' },
  { nombre: 'Santi & Vane', tel: '573166935416', url: 'https://boda-maria-juanca.celebrarte.com.co/santi-y-vane', wa: 'https://wa.me/573166935416?text=https://boda-maria-juanca.celebrarte.com.co/santi-y-vane' },
  { nombre: 'Camilo e Isa', tel: '573102140541', url: 'https://boda-maria-juanca.celebrarte.com.co/camilo-e-isa', wa: 'https://wa.me/573102140541?text=https://boda-maria-juanca.celebrarte.com.co/camilo-e-isa' },
  { nombre: 'Tía Monja', tel: '573104009582', url: 'https://boda-maria-juanca.celebrarte.com.co/tia-monja', wa: 'https://wa.me/573104009582?text=https://boda-maria-juanca.celebrarte.com.co/tia-monja' },
  { nombre: 'Familia Pérez Gonzáles', tel: '573108373737', url: 'https://boda-maria-juanca.celebrarte.com.co/familia-perez-gonzales', wa: 'https://wa.me/573108373737?text=https://boda-maria-juanca.celebrarte.com.co/familia-perez-gonzales' },
  { nombre: 'Familia Pérez Gonzáles', tel: '573116404050', url: 'https://boda-maria-juanca.celebrarte.com.co/familia-perez-gonzales', wa: 'https://wa.me/573116404050?text=https://boda-maria-juanca.celebrarte.com.co/familia-perez-gonzales' },
  { nombre: 'Vivi & Juan Fer', tel: '19545609513', url: 'https://boda-maria-juanca.celebrarte.com.co/vivi-y-juan-fer', wa: 'https://wa.me/19545609513?text=https://boda-maria-juanca.celebrarte.com.co/vivi-y-juan-fer' },
  { nombre: 'Vivi & Juan Fer', tel: '19545601269', url: 'https://boda-maria-juanca.celebrarte.com.co/vivi-y-juan-fer', wa: 'https://wa.me/19545601269?text=https://boda-maria-juanca.celebrarte.com.co/vivi-y-juan-fer' },
  { nombre: 'Santi & Sami', tel: '19545583009', url: 'https://boda-maria-juanca.celebrarte.com.co/santi-y-sami', wa: 'https://wa.me/19545583009?text=https://boda-maria-juanca.celebrarte.com.co/santi-y-sami' },
  { nombre: 'Dani', tel: '19545129793', url: 'https://boda-maria-juanca.celebrarte.com.co/dani', wa: 'https://wa.me/19545129793?text=https://boda-maria-juanca.celebrarte.com.co/dani' },
  { nombre: 'Tía Martha', tel: '573138315297', url: 'https://boda-maria-juanca.celebrarte.com.co/tia-martha', wa: 'https://wa.me/573138315297?text=https://boda-maria-juanca.celebrarte.com.co/tia-martha' },
  { nombre: 'Mami', tel: '573148844045', url: 'https://boda-maria-juanca.celebrarte.com.co/mami', wa: 'https://wa.me/573148844045?text=https://boda-maria-juanca.celebrarte.com.co/mami' },
  { nombre: 'Nati & Cami', tel: '17864501107', url: 'https://boda-maria-juanca.celebrarte.com.co/nati-y-cami', wa: 'https://wa.me/17864501107?text=https://boda-maria-juanca.celebrarte.com.co/nati-y-cami' },
  { nombre: 'Nati & Cami', tel: '17864500930', url: 'https://boda-maria-juanca.celebrarte.com.co/nati-y-cami', wa: 'https://wa.me/17864500930?text=https://boda-maria-juanca.celebrarte.com.co/nati-y-cami' },
  { nombre: 'Moma', tel: '17868544155', url: 'https://boda-maria-juanca.celebrarte.com.co/moma', wa: 'https://wa.me/17868544155?text=https://boda-maria-juanca.celebrarte.com.co/moma' },
  { nombre: 'Lolo', tel: '17864501107', url: 'https://boda-maria-juanca.celebrarte.com.co/lolo', wa: 'https://wa.me/17864501107?text=https://boda-maria-juanca.celebrarte.com.co/lolo' },
  { nombre: 'Vale', tel: '17868545218', url: 'https://boda-maria-juanca.celebrarte.com.co/vale', wa: 'https://wa.me/17868545218?text=https://boda-maria-juanca.celebrarte.com.co/vale' },
  { nombre: 'Kikito & Tutua', tel: '573164699793', url: 'https://boda-maria-juanca.celebrarte.com.co/kikito-y-tutua', wa: 'https://wa.me/573164699793?text=https://boda-maria-juanca.celebrarte.com.co/kikito-y-tutua' },
  { nombre: 'Tutua & Kikito', tel: '13057816964', url: 'https://boda-maria-juanca.celebrarte.com.co/tutua-y-kikito', wa: 'https://wa.me/13057816964?text=https://boda-maria-juanca.celebrarte.com.co/tutua-y-kikito' },
  { nombre: 'Tío Oscar y Tía Vane', tel: '573155123517', url: 'https://boda-maria-juanca.celebrarte.com.co/tio-oscar-y-tia-vane', wa: 'https://wa.me/573155123517?text=https://boda-maria-juanca.celebrarte.com.co/tio-oscar-y-tia-vane' },
  { nombre: 'Tío Oscar y Tía Vane', tel: '573174010914', url: 'https://boda-maria-juanca.celebrarte.com.co/tio-oscar-y-tia-vane', wa: 'https://wa.me/573174010914?text=https://boda-maria-juanca.celebrarte.com.co/tio-oscar-y-tia-vane' },
  { nombre: 'Vane & Pipe', tel: '573113091033', url: 'https://boda-maria-juanca.celebrarte.com.co/vane-y-pipe', wa: 'https://wa.me/573113091033?text=https://boda-maria-juanca.celebrarte.com.co/vane-y-pipe' },
  { nombre: 'Vane & Pipe', tel: '573113091032', url: 'https://boda-maria-juanca.celebrarte.com.co/vane-y-pipe', wa: 'https://wa.me/573113091032?text=https://boda-maria-juanca.celebrarte.com.co/vane-y-pipe' },
  { nombre: 'Anita & Elber', tel: '573104550361', url: 'https://boda-maria-juanca.celebrarte.com.co/anita-y-elber', wa: 'https://wa.me/573104550361?text=https://boda-maria-juanca.celebrarte.com.co/anita-y-elber' },
  { nombre: 'Tía Cynthia', tel: '573153455090', url: 'https://boda-maria-juanca.celebrarte.com.co/tia-cynthia', wa: 'https://wa.me/573153455090?text=https://boda-maria-juanca.celebrarte.com.co/tia-cynthia' },
  { nombre: 'Tía Virginia', tel: '573150668113', url: 'https://boda-maria-juanca.celebrarte.com.co/tia-virginia', wa: 'https://wa.me/573150668113?text=https://boda-maria-juanca.celebrarte.com.co/tia-virginia' },
  { nombre: 'Tía Elvira', tel: '573153561340', url: 'https://boda-maria-juanca.celebrarte.com.co/tia-elvira', wa: 'https://wa.me/573153561340?text=https://boda-maria-juanca.celebrarte.com.co/tia-elvira' },
  { nombre: 'Tío Toño & Moira', tel: '573163258984', url: 'https://boda-maria-juanca.celebrarte.com.co/tio-tono-y-moira', wa: 'https://wa.me/573163258984?text=https://boda-maria-juanca.celebrarte.com.co/tio-tono-y-moira' },
  { nombre: 'Sofi & Mauro', tel: '573154642446', url: 'https://boda-maria-juanca.celebrarte.com.co/sofi-y-mauro', wa: 'https://wa.me/573154642446?text=https://boda-maria-juanca.celebrarte.com.co/sofi-y-mauro' },
  { nombre: 'Primo Esteban', tel: '573176406075', url: 'https://boda-maria-juanca.celebrarte.com.co/primo-esteban', wa: 'https://wa.me/573176406075?text=https://boda-maria-juanca.celebrarte.com.co/primo-esteban' },
  { nombre: 'Eli & Jorge', tel: '573164824311', url: 'https://boda-maria-juanca.celebrarte.com.co/eli-y-jorge', wa: 'https://wa.me/573164824311?text=https://boda-maria-juanca.celebrarte.com.co/eli-y-jorge' },
  { nombre: 'Tía Maria Cristina & Tío Anibal', tel: '573155521769', url: 'https://boda-maria-juanca.celebrarte.com.co/tia-maria-cristina-y-tio-anibal', wa: 'https://wa.me/573155521769?text=https://boda-maria-juanca.celebrarte.com.co/tia-maria-cristina-y-tio-anibal' },
  { nombre: 'Tía Maria Cristina & Tío Anibal', tel: '573155667224', url: 'https://boda-maria-juanca.celebrarte.com.co/tia-maria-cristina-y-tio-anibal', wa: 'https://wa.me/573155667224?text=https://boda-maria-juanca.celebrarte.com.co/tia-maria-cristina-y-tio-anibal' },
  { nombre: 'Primo Anibal y Maria', tel: '573182822727', url: 'https://boda-maria-juanca.celebrarte.com.co/primo-anibal-y-maria', wa: 'https://wa.me/573182822727?text=https://boda-maria-juanca.celebrarte.com.co/primo-anibal-y-maria' },
  { nombre: 'Primo Anibal y Maria', tel: '573155280289', url: 'https://boda-maria-juanca.celebrarte.com.co/primo-anibal-y-maria', wa: 'https://wa.me/573155280289?text=https://boda-maria-juanca.celebrarte.com.co/primo-anibal-y-maria' },
  { nombre: 'Tía Maria Claudia', tel: '573206320024', url: 'https://boda-maria-juanca.celebrarte.com.co/tia-maria-claudia', wa: 'https://wa.me/573206320024?text=https://boda-maria-juanca.celebrarte.com.co/tia-maria-claudia' },
  { nombre: 'Titi & Juan Ca.', tel: '573155659240', url: 'https://boda-maria-juanca.celebrarte.com.co/titi-y-juan-ca', wa: 'https://wa.me/573155659240?text=https://boda-maria-juanca.celebrarte.com.co/titi-y-juan-ca' },
  { nombre: 'Moni & Luis Fer.', tel: '13053087485', url: 'https://boda-maria-juanca.celebrarte.com.co/moni-y-luis-fer', wa: 'https://wa.me/13053087485?text=https://boda-maria-juanca.celebrarte.com.co/moni-y-luis-fer' },
  { nombre: 'Tía Giova & Tío Jimmy', tel: '573108225430', url: 'https://boda-maria-juanca.celebrarte.com.co/tia-giova-y-tio-jimmy', wa: 'https://wa.me/573108225430?text=https://boda-maria-juanca.celebrarte.com.co/tia-giova-y-tio-jimmy' },
  { nombre: 'Tía Giova & Tío Jimmy', tel: '573113403414', url: 'https://boda-maria-juanca.celebrarte.com.co/tia-giova-y-tio-jimmy', wa: 'https://wa.me/573113403414?text=https://boda-maria-juanca.celebrarte.com.co/tia-giova-y-tio-jimmy' },
  { nombre: 'Pao & Feli', tel: '573138451348', url: 'https://boda-maria-juanca.celebrarte.com.co/pao-y-feli', wa: 'https://wa.me/573138451348?text=https://boda-maria-juanca.celebrarte.com.co/pao-y-feli' },
  { nombre: 'Pao & Feli', tel: '573168779406', url: 'https://boda-maria-juanca.celebrarte.com.co/pao-y-feli', wa: 'https://wa.me/573168779406?text=https://boda-maria-juanca.celebrarte.com.co/pao-y-feli' },
  { nombre: 'Mari & Wara', tel: '573113403420', url: 'https://boda-maria-juanca.celebrarte.com.co/mari-y-wara', wa: 'https://wa.me/573113403420?text=https://boda-maria-juanca.celebrarte.com.co/mari-y-wara' },
  { nombre: 'Mari & Wara', tel: '573138863520', url: 'https://boda-maria-juanca.celebrarte.com.co/mari-y-wara', wa: 'https://wa.me/573138863520?text=https://boda-maria-juanca.celebrarte.com.co/mari-y-wara' },
  { nombre: 'July & Tony', tel: '573217604979', url: 'https://boda-maria-juanca.celebrarte.com.co/july-y-tony', wa: 'https://wa.me/573217604979?text=https://boda-maria-juanca.celebrarte.com.co/july-y-tony' },
  { nombre: 'July & Tony', tel: '573128315849', url: 'https://boda-maria-juanca.celebrarte.com.co/july-y-tony', wa: 'https://wa.me/573128315849?text=https://boda-maria-juanca.celebrarte.com.co/july-y-tony' },
  { nombre: 'Tía Paty & Tío Pipo', tel: '573104703881', url: 'https://boda-maria-juanca.celebrarte.com.co/tia-paty-y-tio-pipo', wa: 'https://wa.me/573104703881?text=https://boda-maria-juanca.celebrarte.com.co/tia-paty-y-tio-pipo' },
  { nombre: 'Tía Paty & Tío Pipo', tel: '573104703880', url: 'https://boda-maria-juanca.celebrarte.com.co/tia-paty-y-tio-pipo', wa: 'https://wa.me/573104703880?text=https://boda-maria-juanca.celebrarte.com.co/tia-paty-y-tio-pipo' },
  { nombre: 'Eddy & Lala', tel: '573117631288', url: 'https://boda-maria-juanca.celebrarte.com.co/eddy-y-lala', wa: 'https://wa.me/573117631288?text=https://boda-maria-juanca.celebrarte.com.co/eddy-y-lala' },
  { nombre: 'Eddy & Lala', tel: '573147570804', url: 'https://boda-maria-juanca.celebrarte.com.co/eddy-y-lala', wa: 'https://wa.me/573147570804?text=https://boda-maria-juanca.celebrarte.com.co/eddy-y-lala' },
  { nombre: 'Alejo & Natasha', tel: '573108248160', url: 'https://boda-maria-juanca.celebrarte.com.co/alejo-y-natasha', wa: 'https://wa.me/573108248160?text=https://boda-maria-juanca.celebrarte.com.co/alejo-y-natasha' },
  { nombre: 'Alejo & Natasha', tel: '573103788396', url: 'https://boda-maria-juanca.celebrarte.com.co/alejo-y-natasha', wa: 'https://wa.me/573103788396?text=https://boda-maria-juanca.celebrarte.com.co/alejo-y-natasha' },
  { nombre: 'Cristi & Santi', tel: '573108248159', url: 'https://boda-maria-juanca.celebrarte.com.co/cristi-y-santi', wa: 'https://wa.me/573108248159?text=https://boda-maria-juanca.celebrarte.com.co/cristi-y-santi' },
  { nombre: 'Cristi & Santi', tel: '573176460745', url: 'https://boda-maria-juanca.celebrarte.com.co/cristi-y-santi', wa: 'https://wa.me/573176460745?text=https://boda-maria-juanca.celebrarte.com.co/cristi-y-santi' },
  { nombre: 'Tía Lucia', tel: '573108248157', url: 'https://boda-maria-juanca.celebrarte.com.co/tia-lucia', wa: 'https://wa.me/573108248157?text=https://boda-maria-juanca.celebrarte.com.co/tia-lucia' },
  { nombre: 'Richi', tel: '573202330900', url: 'https://boda-maria-juanca.celebrarte.com.co/richi', wa: 'https://wa.me/573202330900?text=https://boda-maria-juanca.celebrarte.com.co/richi' },
  { nombre: 'Jose & Maria', tel: '573155575365', url: 'https://boda-maria-juanca.celebrarte.com.co/jose-y-maria', wa: 'https://wa.me/573155575365?text=https://boda-maria-juanca.celebrarte.com.co/jose-y-maria' },
  { nombre: 'Jose & Maria', tel: '573165256989', url: 'https://boda-maria-juanca.celebrarte.com.co/jose-y-maria', wa: 'https://wa.me/573165256989?text=https://boda-maria-juanca.celebrarte.com.co/jose-y-maria' },
  { nombre: 'Juan Jo', tel: '573176960842', url: 'https://boda-maria-juanca.celebrarte.com.co/juan-jo', wa: 'https://wa.me/573176960842?text=https://boda-maria-juanca.celebrarte.com.co/juan-jo' },
  { nombre: 'Gus & Male', tel: '573104924669', url: 'https://boda-maria-juanca.celebrarte.com.co/gus-y-male', wa: 'https://wa.me/573104924669?text=https://boda-maria-juanca.celebrarte.com.co/gus-y-male' },
  { nombre: 'Gus & Male', tel: '573187159818', url: 'https://boda-maria-juanca.celebrarte.com.co/gus-y-male', wa: 'https://wa.me/573187159818?text=https://boda-maria-juanca.celebrarte.com.co/gus-y-male' },
  { nombre: 'Tato & Marthica', tel: '573104703878', url: 'https://boda-maria-juanca.celebrarte.com.co/tato-y-marthica', wa: 'https://wa.me/573104703878?text=https://boda-maria-juanca.celebrarte.com.co/tato-y-marthica' },
  { nombre: 'Tato & Marthica', tel: '573104703879', url: 'https://boda-maria-juanca.celebrarte.com.co/tato-y-marthica', wa: 'https://wa.me/573104703879?text=https://boda-maria-juanca.celebrarte.com.co/tato-y-marthica' },
  { nombre: 'Eduardito', tel: '17542681999', url: 'https://boda-maria-juanca.celebrarte.com.co/eduardito', wa: 'https://wa.me/17542681999?text=https://boda-maria-juanca.celebrarte.com.co/eduardito' },
  { nombre: 'Chiaris', tel: '18576939409', url: 'https://boda-maria-juanca.celebrarte.com.co/chiaris', wa: 'https://wa.me/18576939409?text=https://boda-maria-juanca.celebrarte.com.co/chiaris' },
  { nombre: 'Pipe & Gabriela', tel: '17739392829', url: 'https://boda-maria-juanca.celebrarte.com.co/pipe-y-gabriela', wa: 'https://wa.me/17739392829?text=https://boda-maria-juanca.celebrarte.com.co/pipe-y-gabriela' },
  { nombre: 'Anto & Elizaveta', tel: '18578956991', url: 'https://boda-maria-juanca.celebrarte.com.co/anto-y-elizaveta', wa: 'https://wa.me/18578956991?text=https://boda-maria-juanca.celebrarte.com.co/anto-y-elizaveta' },
  { nombre: 'Anto & Elizaveta', tel: '16178383608', url: 'https://boda-maria-juanca.celebrarte.com.co/anto-y-elizaveta', wa: 'https://wa.me/16178383608?text=https://boda-maria-juanca.celebrarte.com.co/anto-y-elizaveta' },
  { nombre: 'Marce', tel: '573175031452', url: 'https://boda-maria-juanca.celebrarte.com.co/marce', wa: 'https://wa.me/573175031452?text=https://boda-maria-juanca.celebrarte.com.co/marce' },
  { nombre: 'Bello & Pao', tel: '573154998405', url: 'https://boda-maria-juanca.celebrarte.com.co/bello-y-pao', wa: 'https://wa.me/573154998405?text=https://boda-maria-juanca.celebrarte.com.co/bello-y-pao' },
  { nombre: 'Margarita', tel: '573102297431', url: 'https://boda-maria-juanca.celebrarte.com.co/margarita', wa: 'https://wa.me/573102297431?text=https://boda-maria-juanca.celebrarte.com.co/margarita' },
  { nombre: 'Jaime & Anita', tel: '13058121003', url: 'https://boda-maria-juanca.celebrarte.com.co/jaime-y-anita', wa: 'https://wa.me/13058121003?text=https://boda-maria-juanca.celebrarte.com.co/jaime-y-anita' },
  { nombre: 'Margarita & Eduardo', tel: '573102991358', url: 'https://boda-maria-juanca.celebrarte.com.co/margarita-y-eduardo', wa: 'https://wa.me/573102991358?text=https://boda-maria-juanca.celebrarte.com.co/margarita-y-eduardo' },
  { nombre: 'Andres & Stephy', tel: '573219227146', url: 'https://boda-maria-juanca.celebrarte.com.co/andres-y-stephy', wa: 'https://wa.me/573219227146?text=https://boda-maria-juanca.celebrarte.com.co/andres-y-stephy' },
  { nombre: 'Pablito & Dani', tel: '573155168688', url: 'https://boda-maria-juanca.celebrarte.com.co/pablito-y-dani', wa: 'https://wa.me/573155168688?text=https://boda-maria-juanca.celebrarte.com.co/pablito-y-dani' },
  { nombre: 'Pablito & Dani', tel: '573123512054', url: 'https://boda-maria-juanca.celebrarte.com.co/pablito-y-dani', wa: 'https://wa.me/573123512054?text=https://boda-maria-juanca.celebrarte.com.co/pablito-y-dani' },
  { nombre: 'Ana & Diego', tel: '12068809452', url: 'https://boda-maria-juanca.celebrarte.com.co/ana-y-diego', wa: 'https://wa.me/12068809452?text=https://boda-maria-juanca.celebrarte.com.co/ana-y-diego' },
  { nombre: 'May & Beto', tel: '573122586897', url: 'https://boda-maria-juanca.celebrarte.com.co/may-y-beto', wa: 'https://wa.me/573122586897?text=https://boda-maria-juanca.celebrarte.com.co/may-y-beto' },
  { nombre: 'Lui & Atiz', tel: '16464684340', url: 'https://boda-maria-juanca.celebrarte.com.co/lui-y-atiz', wa: 'https://wa.me/16464684340?text=https://boda-maria-juanca.celebrarte.com.co/lui-y-atiz' },
  { nombre: 'Zazu & Matt', tel: '34653157289', url: 'https://boda-maria-juanca.celebrarte.com.co/zazu-y-matt', wa: 'https://wa.me/34653157289?text=https://boda-maria-juanca.celebrarte.com.co/zazu-y-matt' },
  { nombre: 'Santi & Mara', tel: '573113315827', url: 'https://boda-maria-juanca.celebrarte.com.co/santi-y-mara', wa: 'https://wa.me/573113315827?text=https://boda-maria-juanca.celebrarte.com.co/santi-y-mara' },
  { nombre: 'Arango & Daniella', tel: '573122741555', url: 'https://boda-maria-juanca.celebrarte.com.co/arango-y-daniella', wa: 'https://wa.me/573122741555?text=https://boda-maria-juanca.celebrarte.com.co/arango-y-daniella' },
  { nombre: 'Gómez e Irene', tel: '573126022454', url: 'https://boda-maria-juanca.celebrarte.com.co/gomez-e-irene', wa: 'https://wa.me/573126022454?text=https://boda-maria-juanca.celebrarte.com.co/gomez-e-irene' },
  { nombre: 'Sarita & Nano', tel: '573184495555', url: 'https://boda-maria-juanca.celebrarte.com.co/sarita-y-nano', wa: 'https://wa.me/573184495555?text=https://boda-maria-juanca.celebrarte.com.co/sarita-y-nano' },
  { nombre: 'Campu & Tati', tel: '14075779519', url: 'https://boda-maria-juanca.celebrarte.com.co/campu-y-tati', wa: 'https://wa.me/14075779519?text=https://boda-maria-juanca.celebrarte.com.co/campu-y-tati' },
  { nombre: 'Nate & Camille', tel: '447525432574', url: 'https://boda-maria-juanca.celebrarte.com.co/nate-y-camille', wa: 'https://wa.me/447525432574?text=https://boda-maria-juanca.celebrarte.com.co/nate-y-camille' },
  { nombre: 'Sebas', tel: '573175176965', url: 'https://boda-maria-juanca.celebrarte.com.co/sebas', wa: 'https://wa.me/573175176965?text=https://boda-maria-juanca.celebrarte.com.co/sebas' },
  { nombre: 'Santi & Megan', tel: '13322888476', url: 'https://boda-maria-juanca.celebrarte.com.co/santi-y-megan', wa: 'https://wa.me/13322888476?text=https://boda-maria-juanca.celebrarte.com.co/santi-y-megan' },
  { nombre: 'Sebas & Mari', tel: '573206327272', url: 'https://boda-maria-juanca.celebrarte.com.co/sebas-y-mari', wa: 'https://wa.me/573206327272?text=https://boda-maria-juanca.celebrarte.com.co/sebas-y-mari' },
  { nombre: 'Soichi & Sarah', tel: '16616733916', url: 'https://boda-maria-juanca.celebrarte.com.co/soichi-y-sarah', wa: 'https://wa.me/16616733916?text=https://boda-maria-juanca.celebrarte.com.co/soichi-y-sarah' },
  { nombre: 'Mauricio & Juliana', tel: '573207271811', url: 'https://boda-maria-juanca.celebrarte.com.co/mauricio-y-juliana', wa: 'https://wa.me/573207271811?text=https://boda-maria-juanca.celebrarte.com.co/mauricio-y-juliana' },
  { nombre: 'Esteban & Laura', tel: '573174300021', url: 'https://boda-maria-juanca.celebrarte.com.co/esteban-y-laura', wa: 'https://wa.me/573174300021?text=https://boda-maria-juanca.celebrarte.com.co/esteban-y-laura' },
  { nombre: 'Esteban & Laura', tel: '573154852605', url: 'https://boda-maria-juanca.celebrarte.com.co/esteban-y-laura', wa: 'https://wa.me/573154852605?text=https://boda-maria-juanca.celebrarte.com.co/esteban-y-laura' },
  { nombre: 'Rick', tel: '573176683162', url: 'https://boda-maria-juanca.celebrarte.com.co/rick', wa: 'https://wa.me/573176683162?text=https://boda-maria-juanca.celebrarte.com.co/rick' },
  { nombre: 'Vilma & Luis', tel: '573155765515', url: 'https://boda-maria-juanca.celebrarte.com.co/vilma-y-luis', wa: 'https://wa.me/573155765515?text=https://boda-maria-juanca.celebrarte.com.co/vilma-y-luis' },
  { nombre: 'Yamile Abrahim', tel: '573208025753', url: 'https://boda-maria-juanca.celebrarte.com.co/yamile-abrahim', wa: 'https://wa.me/573208025753?text=https://boda-maria-juanca.celebrarte.com.co/yamile-abrahim' },
  { nombre: 'Luis & Marce', tel: '573104124334', url: 'https://boda-maria-juanca.celebrarte.com.co/luis-y-marce', wa: 'https://wa.me/573104124334?text=https://boda-maria-juanca.celebrarte.com.co/luis-y-marce' },
  { nombre: 'Ruben & Betty', tel: '573216432308', url: 'https://boda-maria-juanca.celebrarte.com.co/ruben-y-betty', wa: 'https://wa.me/573216432308?text=https://boda-maria-juanca.celebrarte.com.co/ruben-y-betty' },
  { nombre: 'Alejandro & Astrid', tel: '573113018257', url: 'https://boda-maria-juanca.celebrarte.com.co/alejandro-y-astrid', wa: 'https://wa.me/573113018257?text=https://boda-maria-juanca.celebrarte.com.co/alejandro-y-astrid' },
  { nombre: 'Jorge & María del Rosario', tel: '573155279999', url: 'https://boda-maria-juanca.celebrarte.com.co/jorge-y-maria-del-rosario', wa: 'https://wa.me/573155279999?text=https://boda-maria-juanca.celebrarte.com.co/jorge-y-maria-del-rosario' },
  { nombre: 'Mauricio & Marisa', tel: '573164667936', url: 'https://boda-maria-juanca.celebrarte.com.co/mauricio-y-marisa', wa: 'https://wa.me/573164667936?text=https://boda-maria-juanca.celebrarte.com.co/mauricio-y-marisa' },
  { nombre: 'Fabio e Irene', tel: '573154761284', url: 'https://boda-maria-juanca.celebrarte.com.co/fabio-e-irene', wa: 'https://wa.me/573154761284?text=https://boda-maria-juanca.celebrarte.com.co/fabio-e-irene' },
  { nombre: 'Alejandro & Claudia', tel: '573104743696', url: 'https://boda-maria-juanca.celebrarte.com.co/alejandro-y-claudia', wa: 'https://wa.me/573104743696?text=https://boda-maria-juanca.celebrarte.com.co/alejandro-y-claudia' },
  { nombre: 'Tata Bedoya', tel: '573003141848', url: 'https://boda-maria-juanca.celebrarte.com.co/tata-bedoya', wa: 'https://wa.me/573003141848?text=https://boda-maria-juanca.celebrarte.com.co/tata-bedoya' },
  { nombre: 'María Paulina Escobar', tel: '573183585878', url: 'https://boda-maria-juanca.celebrarte.com.co/maria-paulina-escobar', wa: 'https://wa.me/573183585878?text=https://boda-maria-juanca.celebrarte.com.co/maria-paulina-escobar' },
  { nombre: 'Pablo Vernaza', tel: '573155507486', url: 'https://boda-maria-juanca.celebrarte.com.co/pablo-vernaza', wa: 'https://wa.me/573155507486?text=https://boda-maria-juanca.celebrarte.com.co/pablo-vernaza' },
  { nombre: 'Yolanda Suárez', tel: '573002019080', url: 'https://boda-maria-juanca.celebrarte.com.co/yolanda-suarez', wa: 'https://wa.me/573002019080?text=https://boda-maria-juanca.celebrarte.com.co/yolanda-suarez' },
  { nombre: 'Juan Camilo & Laura', tel: '573232038430', url: 'https://boda-maria-juanca.celebrarte.com.co/juan-camilo-y-laura', wa: 'https://wa.me/573232038430?text=https://boda-maria-juanca.celebrarte.com.co/juan-camilo-y-laura' },
  { nombre: 'Fernando Calero', tel: '', url: 'https://boda-maria-juanca.celebrarte.com.co/fernando-calero', wa: '' },
  { nombre: 'Dani & Santi', tel: '', url: 'https://boda-maria-juanca.celebrarte.com.co/dani-y-santi', wa: '' },
  { nombre: 'Margara y Jose', tel: '', url: 'https://boda-maria-juanca.celebrarte.com.co/margara-y-jose', wa: '' },
];

const C = {
  bg: '#FAF5FB', surface: '#FFFFFF', border: '#EAD9ED',
  text: '#1A0A1C', muted: '#7A5880', subtle: '#B09AB5',
  brand: '#5A1B5E', brandBg: '#F3E8F5',
  green: '#1A7A3C', greenBg: '#E6F4EC',
  warn: '#C0392B', warnBg: '#FDECEA',
  accent: '#8B3D90', accentBg: '#EDD9EE',
  yellow: '#92660A', yellowBg: '#FEF3C7',
};
const font = "'Inter','Montserrat',system-ui,sans-serif";

export default function Dashboard() {
  const [pin, setPin] = useState('');
  const [auth, setAuth] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [rows, setRows] = useState<RsvpRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'si' | 'no'>('all');
  const [tab, setTab] = useState<'rsvp' | 'invitados'>('rsvp');
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [sent, setSent] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('mj_sent') || '[]')); }
    catch { return new Set(); }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === DASHBOARD_PIN) { setAuth(true); setPinError(false); }
    else setPinError(true);
  };

  useEffect(() => {
    if (!auth) return;
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('rsvp_responses')
        .select('*')
        .eq('evento_id', EVENTO_ID)
        .order('created_at', { ascending: false });
      setRows((data ?? []) as RsvpRow[]);
      setLoading(false);
    };
    load();
    const ch = supabase
      .channel('rsvp_live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'rsvp_responses' }, p => {
        const row = p.new as RsvpRow;
        if (row.evento_id === EVENTO_ID) setRows(prev => [row, ...prev]);
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [auth]);

  const si = rows.filter(r => r.asiste).length;
  const no = rows.filter(r => !r.asiste).length;
  const visible = filter === 'all' ? rows : rows.filter(r => r.asiste === (filter === 'si'));

  const fmt = (d: string) =>
    new Date(d).toLocaleString('es-CO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

  const filteredGuests = GUESTS.filter(g =>
    g.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const copyUrl = (url: string, key: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    });
  };

  const markSent = (tel: string) => {
    setSent(prev => {
      const next = new Set(prev);
      next.add(tel);
      try { localStorage.setItem('mj_sent', JSON.stringify([...next])); } catch {}
      return next;
    });
  };

  /* ── Login ── */
  if (!auth) return (
    <div style={{ minHeight: '100dvh', background: C.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: font, padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.brand, display: 'inline-block' }} />
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.brand }}>Celebrarte</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: '0 0 6px' }}>Panel de confirmaciones</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>Ingresa tu PIN para continuar</p>
        </div>

        <form onSubmit={handleLogin} style={{ background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, padding: '28px 24px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
            PIN de acceso
          </label>
          <input
            type="password"
            placeholder="••••••••••••"
            value={pin}
            autoComplete="off"
            onChange={e => { setPin(e.target.value); setPinError(false); }}
            style={{
              width: '100%', padding: '11px 14px', borderRadius: 8,
              border: `1.5px solid ${pinError ? '#F04438' : C.border}`,
              fontFamily: font, fontSize: 15, outline: 'none', color: C.text,
              background: '#FAFAFA', boxSizing: 'border-box',
              marginBottom: pinError ? 8 : 16,
            }}
          />
          {pinError && <p style={{ fontSize: 12, color: '#F04438', marginBottom: 14 }}>PIN incorrecto. Intenta de nuevo.</p>}
          <button type="submit" style={{
            width: '100%', padding: '12px', background: C.brand, color: '#fff',
            border: 'none', borderRadius: 8, fontFamily: font, fontSize: 14,
            fontWeight: 600, cursor: 'pointer',
          }}>
            Ingresar
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: C.subtle }}>
          Creado por:{' '}
          <a href="https://celebrarte.com.co/" target="_blank" rel="noopener noreferrer"
            style={{ color: C.brand, fontWeight: 600, textDecoration: 'none' }}>Celebrarte</a>
          {' & '}
          <a href="https://oswalstudio.com/" target="_blank" rel="noopener noreferrer"
            style={{ color: C.brand, fontWeight: 600, textDecoration: 'none' }}>Oswal Studio</a>
        </p>
      </div>
    </div>
  );

  /* ── Dashboard ── */
  return (
    <div style={{ minHeight: '100dvh', background: C.bg, fontFamily: font }}>

      {/* Topbar */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 54 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.brand, display: 'inline-block' }} />
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.brand }}>Celebrarte</span>
            <span style={{ color: C.border, margin: '0 2px' }}>|</span>
            <span style={{ fontSize: 13, color: C.muted }}>RSVP · María &amp; Juanca</span>
          </div>
          <span style={{ fontSize: 11, color: C.subtle, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#12B76A', display: 'inline-block', animation: 'pulse 2s ease infinite' }} />
            En vivo
          </span>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        html, body { height: auto !important; overflow-y: auto !important; }
      `}</style>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '24px 16px 48px' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 4, width: 'fit-content' }}>
          {(['rsvp', 'invitados'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '7px 18px', borderRadius: 7, border: 'none', cursor: 'pointer',
              fontFamily: font, fontSize: 13, fontWeight: 600,
              background: tab === t ? C.brand : 'transparent',
              color: tab === t ? '#fff' : C.muted,
              transition: 'all 0.15s',
            }}>
              {t === 'rsvp' ? 'Confirmaciones' : `Invitaciones (${GUESTS.length})`}
            </button>
          ))}
        </div>

        {tab === 'rsvp' && (
          <>
            {/* Contadores */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
              {[
                { label: 'Confirman', value: si, color: C.green },
                { label: 'No asisten', value: no, color: C.warn },
                { label: 'Total', value: rows.length, color: C.brand },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 12px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <p style={{ fontSize: 32, fontWeight: 800, color, margin: '0 0 4px', lineHeight: 1 }}>{value}</p>
                  <p style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Filtros */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              {(['all', 'si', 'no'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  padding: '7px 14px', borderRadius: 20,
                  border: `1.5px solid ${filter === f ? C.brand : C.border}`,
                  background: filter === f ? C.brandBg : C.surface,
                  color: filter === f ? C.brand : C.muted,
                  fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: font,
                }}>
                  {f === 'all' ? 'Todos' : f === 'si' ? '✓ Confirman' : '✗ No asisten'}
                </button>
              ))}
            </div>

            {/* Lista RSVP */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              {loading ? (
                <p style={{ textAlign: 'center', padding: 40, color: C.muted, fontSize: 13 }}>Cargando...</p>
              ) : visible.length === 0 ? (
                <p style={{ textAlign: 'center', padding: 40, color: C.subtle, fontSize: 13 }}>
                  {rows.length === 0 ? 'Aún no hay confirmaciones' : 'Sin resultados'}
                </p>
              ) : visible.map((r, i) => (
                <div key={r.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '13px 18px',
                  borderBottom: i < visible.length - 1 ? `1px solid ${C.border}` : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                      background: r.asiste ? C.greenBg : C.warnBg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 700, color: r.asiste ? C.green : C.warn,
                    }}>
                      {r.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: C.text, margin: 0 }}>{r.nombre}</p>
                      <p style={{ fontSize: 11, color: C.subtle, margin: '2px 0 0' }}>{fmt(r.created_at)}</p>
                    </div>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: r.asiste ? C.green : C.warn,
                    background: r.asiste ? C.greenBg : C.warnBg,
                    padding: '4px 10px', borderRadius: 20,
                  }}>
                    {r.asiste ? 'Sí' : 'No'}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'invitados' && (
          <>
            {/* Buscador */}
            <input
              placeholder="Buscar invitación..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 8, boxSizing: 'border-box',
                border: `1.5px solid ${C.border}`, fontFamily: font, fontSize: 14,
                color: C.text, background: C.surface, outline: 'none', marginBottom: 14,
              }}
            />

            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              {/* Header */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 110px 80px auto',
                padding: '10px 16px', borderBottom: `1px solid ${C.border}`,
                background: C.bg,
              }}>
                {['Invitado', 'Celular', 'Estado', 'Acciones'].map(h => (
                  <span key={h} style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</span>
                ))}
              </div>

              {/* Scrollable list */}
              <div style={{ maxHeight: 520, overflowY: 'auto' }}>
                {filteredGuests.length === 0 ? (
                  <p style={{ textAlign: 'center', padding: 32, color: C.subtle, fontSize: 13 }}>Sin resultados</p>
                ) : filteredGuests.map((g, i) => {
                  const isSent = sent.has(g.tel);
                  const copyKey = g.nombre + g.tel + '_copy';
                  return (
                    <div key={g.nombre + g.tel} style={{
                      display: 'grid', gridTemplateColumns: '1fr 110px 80px auto',
                      alignItems: 'center', padding: '11px 16px',
                      borderBottom: i < filteredGuests.length - 1 ? `1px solid ${C.border}` : 'none',
                    }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{g.nombre}</span>
                      <span style={{ fontSize: 12, color: C.muted, fontVariantNumeric: 'tabular-nums' }}>
                        +{g.tel}
                      </span>
                      <span style={{
                        display: 'inline-block', fontSize: 10, fontWeight: 700,
                        letterSpacing: '0.06em', textTransform: 'uppercase',
                        padding: '3px 8px', borderRadius: 20,
                        background: isSent ? C.greenBg : C.yellowBg,
                        color: isSent ? C.green : C.yellow,
                      }}>
                        {isSent ? 'Enviado' : 'Pendiente'}
                      </span>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => copyUrl(g.url, copyKey)}
                          title="Copiar link"
                          style={{
                            padding: '5px 10px', borderRadius: 6, border: `1px solid ${C.border}`,
                            background: copied === copyKey ? C.greenBg : C.surface,
                            color: copied === copyKey ? C.green : C.muted,
                            fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: font,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {copied === copyKey ? '✓' : '🔗'}
                        </button>
                        {g.wa && (
                          <a
                            href={g.wa}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => markSent(g.tel)}
                            style={{
                              padding: '5px 10px', borderRadius: 6,
                              background: isSent ? '#128C7E' : '#25D366', color: '#fff',
                              fontSize: 12, fontWeight: 600, textDecoration: 'none',
                              whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center',
                            }}
                          >
                            WA
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        <p style={{ textAlign: 'center', fontSize: 11, color: C.subtle, marginTop: 20 }}>
          Creado por:{' '}
          <a href="https://celebrarte.com.co/" target="_blank" rel="noopener noreferrer"
            style={{ color: C.brand, fontWeight: 600, textDecoration: 'none' }}>Celebrarte</a>
          {' & '}
          <a href="https://oswalstudio.com/" target="_blank" rel="noopener noreferrer"
            style={{ color: C.brand, fontWeight: 600, textDecoration: 'none' }}>Oswal Studio</a>
        </p>
      </div>
    </div>
  );
}
