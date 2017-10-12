# coding: UTF-8
import re
import csv
import uuid
import json

# creates popolo json in a way like somehtingnewuk does
# https://github.com/SomethingNewUK/popolo-data

party_shorten = {
	"自由民主党":"自民",
	"Independent":"無所属",
	"日本共産党":"共産",
	"社会民主党":"社民",
	"公明党":"公明",
	"新社会党":"社会",
	"新党大地":"大地",
	"幸福実現党":"幸福",
	"自由党":"自由",
	"日本のこころ":"こころ",
	"支持政党なし":"支持なし",
	"日本維新の会":"維新",
	"民進党":"民進",
	"希望の党":"希望",
	"立憲民主党":"立民",
	"労働の解放をめざす労働者党":"労働",
	"無所":"無所属",
}

area2q = {d["name"]:d["qname"] for d in csv.DictReader(open("areas.csv"))}

orgs = list(csv.DictReader(open("organizations.csv")))
org2id = dict([(party_shorten.get(o["name"], o["name"]), o["ident"]) for o in orgs])
organizations = [dict(
	id= o["ident"],
	name= o["name"],
	identifiers=[{"scheme":"wikidata","identifier":o["qname"]}],
	classfication= o["classification"]) for o in orgs]

q2ep = dict([(wd,ep) for ep,wd in csv.DictReader(open("ep_id_map.csv"))])

def load_gdb():
	key_conv = {
		"誕生日":"生年月日",
		"選挙用表記名/別名":"候補名",
		"名前（姓）":"姓",
		"名前（名）":"名",
		"公認政党":"政党",
		"担当":None,
		"作業予定日":None,
		"完了日":None,
		"名前（フル）":"名前",
		"名（フリガナ）":"メイ",
		"姓（フリガナ）":"セイ",
		"Twitterアドレス":"twitter",
		"Facebookページアドレス":"facebook",
		"メモ": None
	}
	db = [[c.strip() for c in r] for r in csv.reader(open("gdoc_gray_db.csv", encoding="UTF-8")) if "".join(r)]
	for i, r in enumerate(db):
		if "wikidata" in r:
			break
	keys = [key_conv.get(e,e) for e in db[i]] # normalize keys
	for r in db[i+1:]:
		k = keys.index("小選挙区")
		v = r[k]
		m0 = re.match("東京(\d+)区", v)
		m = re.match("(\S+)(\d+)区", v)
		if m0:
			v = "東京都第%s区" % m0.group(1)
		elif m:
			if m.group(1) == "北海道":
				v = "%s第%s区" % m.groups()
			elif m.group(1) in "大阪 京都".split():
				v = "%s府第%s区" % m.groups()
			else:
				v = "%s県第%s区" % m.groups()
		else:
			v = v.replace(" ","第")
		
		r[k] = v
		
		k = keys.index("比例区")
		if r[k]:
			r[k] = "比例%sブロック" % r[k]
	
	return keys, db[i+1:]

gk,gdb = load_gdb()

persons = []
for r in gdb:
	q = r[gk.index("wikidata")]
	if q in q2ep:
		ep = q2ep[q]
	else:
		ep = "%s" % uuid.uuid4()
		q2ep[q] = ep
	
	p = dict(
		id= ep,
		name= r[gk.index("名前")],
		identifiers= [{"scheme":"wikidata", "identifier":q}],
		gender= ("male", "female")[0 if r[gk.index("性別")].startswith("男") else 1],
	)
	
	other_names = [{"name":n, "note":"kana mixed or different glyph in use"}
		for n in r[gk.index("候補名")].split("\n") if n]
	if other_names:
		p["other_names"] = other_names
	
	twitter = [{"type":"twitter", "value":tw} for tw in r[gk.index("twitter")].split("\n") if tw]
	if twitter:
		p["contact_details"] = p.get("contact_details",[]) + twitter
	
	if r[gk.index("生年月日")]:
		p["birth_date"] = r[gk.index("生年月日")]
	persons.append(p)

event = dict(
	id= "%s" % uuid.uuid4(),
	name= "第48回衆議院議員総選挙",
	start_date= "2017-10-10",
	end_date= "2017-10-22",
	location= "日本",
	identifiers= [{"scheme":"wikidata", "identifier":"Q20983100"}],
	organization_id= org2id["衆議院"],
	classification= "election",
	attendees=[{"id":p["id"]} for p in persons],
)

posts = [dict(
	id= k,
	label= k,
	role= "衆議院議員",
	organization_id= org2id["衆議院"],
	identifiers=[{"scheme":"wikidata", "identifier":area2q[k]}],
) for k in set([
	r[gk.index("小選挙区")] for r in gdb if r[gk.index("小選挙区")]
] + [
	r[gk.index("比例区")] for r in gdb if r[gk.index("比例区")]
])]

memberships = [dict(
	post_id= "小選挙区 %s" % r[gk.index("小選挙区")],
	organization_id= org2id[party_shorten.get(
		r[gk.index("政党")], r[gk.index("政党")])],
	person_id= q2ep[r[gk.index("wikidata")]],
	) for r in gdb if r[gk.index("小選挙区")]
] + [dict(
	post_id= "比例区 %s" % r[gk.index("比例区")],
	organization_id= org2id[party_shorten.get(
		r[gk.index("政党")], r[gk.index("政党")])],
	person_id= q2ep[r[gk.index("wikidata")]])
	for r in gdb if r[gk.index("比例区")]
]

candidacies = [dict(
	id= "%s" % uuid.uuid4(),
	event_id= event["id"],
	name= "衆議院議員",
	role= "candidancy",
	organization_id= org2id[party_shorten.get(
		r[gk.index("政党")], r[gk.index("政党")])],
	person_id= q2ep[r[gk.index("wikidata")]])
	for r in gdb]

import sys
json.dump({"elections": [event],
	"people": persons,
	"posts": posts,
	"memberships": memberships,
	"organizations": organizations,
	"candicacies": candidacies,
}, sys.stdout, indent=2, sort_keys=True, ensure_ascii=False)
