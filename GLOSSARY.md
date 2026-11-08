# Glossary · Γλωσσάρι

The terms the CONGEO tools use, English | Greek | note. English follows BS 7671 (IET Wiring Regulations) where it
applies. Use these; do not invent others. A term marked **⚠ George** is one I was not sure of: confirm or correct it
before it is used in a tool.

Rhoi already uses many of these (`web/src/i18n.ts`); where it does, the Greek here is Rhoi's.

## Electrical · Ηλεκτρολογικά

| English | Greek | note |
|---|---|---|
| distribution board | πίνακας διανομής | BS 7671 term. Rhoi: «Πίνακες διανομής». «Πίνακας» alone in running text. |
| consumer unit | πίνακας | the domestic board; BS 7671 uses *consumer unit*. Confirmed by George (8 Nov 2026): «πίνακας» in the interface, «πίνακας διανομής» in documents. |
| sub-board | υποπίνακας | Rhoi: «Τροφοδοσία υποπίνακα» |
| final circuit | τελικό κύκλωμα | BS 7671. Rhoi: «τα τελικά κυκλώματα» |
| ring final circuit | δακτύλιος, κύκλωμα δακτυλίου | Rhoi: «δακτύλιος» |
| radial circuit | ακτινικό κύκλωμα | Rhoi: «ακτινικό» |
| MCB (miniature circuit breaker) | μικροαυτόματος (MCB) | keep the abbreviation in both languages. Rhoi: «Μικροαυτόματος (MCB)» |
| RCD (residual current device) | διάταξη διαφορικού ρεύματος (RCD) | Rhoi: «διάταξη διαφορικού ρεύματος», abbreviated «ΔΔΡ» or kept as RCD. Prefer **RCD** in both. The colloquial «ρελέ διαρροής» is not used. |
| RCBO | RCBO | not translated; Rhoi: «Υπερένταση και ΔΔΡ σε ένα» as the explanation |
| RCCB | RCCB | not translated |
| SPD (surge protective device) | διάταξη προστασίας από υπερτάσεις (SPD) | Rhoi: «Προστασία υπερτάσεων (SPD)» |
| socket outlet | ρευματοδότης | BS 7671 says *socket-outlet*; the tools write *socket outlet*. Rhoi: «Ρευματοδότες». Colloquial «πρίζα» only in casual UI copy, never in documents. |
| luminaire | φωτιστικό | BS 7671 term (not *light fitting*). Rhoi: «Φωτιστικό» |
| switch | διακόπτης | |
| two-way switch | αλέ-ρετούρ | Rhoi: «Αλέ-ρετούρ». Confirmed by George (8 Nov 2026): the term electricians use, also in documents. |
| isolator | διακόπτης απομόνωσης | Rhoi |
| fused spur / fused connection unit | σταθερή σύνδεση (fused spur) | Rhoi keeps the English in brackets |
| cable size (cross-sectional area) | διατομή καλωδίου | BS 7671: *csa*. Rhoi: «διατομή» |
| earthing | γείωση | Rhoi: «Γείωση», «Σύστημα γείωσης», «Αγωγός γείωσης» |
| protective conductor (cpc) | αγωγός προστασίας | Rhoi |
| bonding | ισοδυναμική σύνδεση | BS 7671 *protective bonding*. Confirmed by George (8 Nov 2026). |
| main switch | γενικός διακόπτης | Rhoi: «Γενικός διακόπτης», «Γενικός» in a short label |
| tails (meter tails) | καλώδια μετρητή | Rhoi: «Καλώδια μετρητή» |
| meter | μετρητής | Rhoi: «Κύριος μετρητής» |
| supply | παροχή | Rhoi: «Παροχή» |
| origin of the installation | αφετηρία της εγκατάστασης | Rhoi |
| voltage drop | πτώση τάσης | Rhoi |
| fault current | ρεύμα σφάλματος | Rhoi |
| prospective fault current | προσδοκώμενο ρεύμα σφάλματος | Rhoi (in a long text); short label «ρεύμα βραχυκύκλωσης» also appears. Prefer «προσδοκώμενο ρεύμα σφάλματος» in documents. |
| earth fault loop impedance (Zs) | σύνθετη αντίσταση βρόχου σφάλματος (Zs) | Rhoi |
| insulation resistance | αντίσταση μόνωσης | Rhoi |
| single-line diagram | μονογραμμικό (διάγραμμα) | Rhoi: «Μονογραμμικό» |
| circuit chart | κατάλογος κυκλωμάτων | Rhoi: «κατάλογοι κυκλωμάτων» |
| legend | υπόμνημα | Rhoi |
| mounting height | ύψος τοποθέτησης | Rhoi |
| fire alarm panel | πίνακας πυρανίχνευσης | Rhoi |
| emergency lighting | φωτισμός ασφαλείας | Rhoi |
| EAC (Electricity Authority of Cyprus) | ΑΗΚ | the authority; never translated word for word |
| ΗΜΥ | ΗΜΥ | Department of Electrical and Mechanical Services; the form names (ΗΜΥ 58.18-1) stay as they are in both |
| ETEK | ΕΤΕΚ | the Cyprus Scientific and Technical Chamber; «ETEK» in English text |

## Project · Έργο

| English | Greek | note |
|---|---|---|
| project | έργο | «Έργο 0637» in the data contract, both languages keep the Greek line |
| project number | αριθμός έργου | the four digits, mono |
| design | μελέτη | section 01. Confirmed by George (8 Nov 2026): **design** everywhere in English (interface and documents), never *study*. |
| electrical installation design | μελέτη ηλεκτρολογικής εγκατάστασης | Rhoi (title block); English follows *design* above |
| site supervision | επίβλεψη | section 03. Greek has no «εργοταξίου» in the section name. |
| site visit | επίσκεψη στο έργο | Confirmed by George (8 Nov 2026), as in Rhoi. The calendar's «επίσκεψη στο εργοτάξιο» changes to this. |
| site | εργοτάξιο | the place; «τοποθεσία» is the address field (Rhoi: «Τοποθεσία») |
| as-built (drawings) | σχέδια όπως κατασκευάστηκαν | section 04 keeps «As-built» in both languages (the approved Project hub) |
| permit | άδεια | section 02; «άδεια οικοδομής» when the full term is needed |
| planning permit | πολεοδομική άδεια | Confirmed by George (8 Nov 2026); distinct from building permit. |
| building permit | άδεια οικοδομής | |
| incoming files | εισερχόμενα | section 00 |
| documents | έγγραφα | section 06 |
| finance | οικονομικά | section 05 |
| architectural (drawings) | αρχιτεκτονικά | |
| mechanical (drawings) | μηχανολογικά | Rhoi: «το μηχανολογικό» |
| structural (drawings) | στατικά | Rhoi: «τα στατικά» |
| owner | ιδιοκτήτης | Rhoi: «Ιδιοκτήτης» |
| client | πελάτης | Rhoi: «Πελάτης» (the title block) |
| contractor | εργολάβος | Rhoi: «Εργολάβος»; «Κυρίως Εργολάβος» for *main contractor* |
| subcontractor | υπεργολάβος | Rhoi |
| engineer | μηχανικός | |
| architect | αρχιτέκτονας | the mockups: «από αρχιτέκτονα» |
| proposal (AI suggestion) | πρόταση | the purple card, «ΠΡΟΤΑΣΗ» |
| task | εργασία | the calendar |
| drawing | σχέδιο | Rhoi |
| sheet (drawing no.) | φύλλο, αρ. σχεδίου | Rhoi: «Αρ. σχεδίου» |
| revision | αναθεώρηση | Rhoi |
| issue (first issue) | έκδοση | Rhoi: «Πρώτη έκδοση»; the hub: «Έκδοση 2» |

## Office · Γραφείο

| English | Greek | note |
|---|---|---|
| invoice | τιμολόγιο | |
| quote (quotation) | προσφορά | Rhoi: «προσφορά» |
| receipt | απόδειξη | |
| credit note | πιστωτικό σημείωμα | |
| VAT | ΦΠΑ | Rhoi: «ΦΠΑ»; the registration number «Αρ. εγγραφής ΦΠΑ» |
| expense | έξοδο | Confirmed by George (8 Nov 2026): «έξοδο» / «έξοδα» in the interface. |
| payment | πληρωμή | |
| due date | προθεσμία πληρωμής | |
| outstanding (open) | ανοιχτό | the hub: «1 ανοιχτό» |
| fee | αμοιβή | |
| statement | κατάσταση λογαριασμού | Confirmed by George (8 Nov 2026). |

## Interface words that are not terms

Save, Cancel, Delete, Undo, Retry, Close, Back, Search, Settings, Offline, Today, Yesterday, Tomorrow and the rest live
in `src/i18n/common.ts`, both languages, and are used through `t('save')`.
