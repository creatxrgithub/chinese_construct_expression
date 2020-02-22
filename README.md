# 漢字形義正則法〔計算機漢字構建及其正則文法研究〕

〔如果本文顯示有缺字﹐請安裝花園字體或一點明體或開心宋體〕

# 摘要：

本着「追溯古人造字之謎﹐尋究漢學傳承之道」的理念﹐我研究了一下小篆﹐尋求字之所以構造的含義﹐探索漢字的有序化﹐及其計算機的輸入與生成。

**關鍵字：漢字﹐輸入法﹐教學﹐正則文法﹐自動化造字﹐可變字體 opentype variable font**

The Research Of Construct Chinese Character With Computer And Its Regular Expression

In order to get the idea how the ancients construct Chinese character, in order to find a new better way to learn and teach Chinese character, I did a research with character Xiaozhuan. I try to find the regularity of Chinese character and its meaning. I try to get a easy method that the computer could construct a Chinese character if it is a new one or it isn」t in the font library (eg. .ttf files).

# 引言：

鑑於五筆或倉頡這類輸入法的拆分過於零散難解、拼音或注音這類輸入法的拉丁化及大量重碼、二筆輸入法這類需音形同時知曉才能錄入的不足。這些輸入法不能應用於指導漢字教學、不能應用於計算機圖形化生成及統一簡化建議、不能應用於漢字的串行化表示〔如英文單詞〕、不能應用於檢索漢字構造、也不能如拉丁化語言那樣隨時隨意生成新字〔如果有必要﹐比如新粒子的命名〕。我將這些應用需求統合在一起﹐提供一个可行的一致的簡易的方案﹐並將其命名爲「漢字形義正則法」。

# 一、「漢字形義正則法」命名緣由及其意義：

「正則法」指的是計算理論裏﹐可以被自動機 DFA 或 NFA 識別的文法。比如常用於字符串搜索的「正則表達式」。「形義」指要以漢字的有完整意義的字形作爲拆分的主要及重要依據。如將「龍象」作爲字根﹐對應鍵盤的Z鍵。所有的象形文字都應該是字根﹐不再拆分。需要拆分的是六書中的會意、形聲等。

漢字是三維立體的﹐有上下左右裏外之分。「漢字形義正則法」使用二維描述符以正則的文法構建三維漢字。使得人或計算機在不知道是哪个字、或沒有字體庫的情况下﹐仍然可以依據表達式「劃」出字形﹐尢其是小篆字形﹐還能參照通常的變形規則〔比如：「手」化作「扌」〕﹐「劃」出隶化後的字形。這種方法也可以用於啓發漢字教學。

建國以來﹐爲了掃除文盲作了多種嘗試。興辦學校﹐使得受教育的人口極大增長﹐功勞不小；文字改革﹐不甚理想。最讓人難以忍受的是那種「多化一」的現象﹐用一个叉代替多種不同形狀的字形﹐比如：「鳳鷄鄧權漢樹敍疊雙戲聶」；「趙風區岡鹵」。這極大地影響了漢字的傳承和演變。**漢字的演變﹐應該是一个字形向下分支﹐可以有多種寫法﹐但不與其他字形混淆混用﹐以便於溯源。**「種瓜黃臺下﹐瓜熟子離離。一摘使瓜好﹐再摘令瓜稀﹐三摘猶尙可﹐四摘抱蔓歸。」幸而﹐拉丁化思潮終究止住了。

中國有那麼多的方言﹐可以對同一文字作不同的發音。說明漢字研究要以字形字義爲主。通過對字形組合及其各方言的發音統計與研究﹐或可探究出音與形的對應關係。而不是象教育部那樣將錯就錯隨意更改文字的讀音。

# 二、「漢字形義正則法」的實現方案：

## 第一﹐需要設計一个正則文法：〔本方案中以半角字符定義符號〕

^：表示字體結構從上至下﹐比如：尖﹐表達式爲：^(小大)；

<：表示字體結構從左至右﹐比如：們﹐表達式爲：<(人門)；

{}：表示內包圍結構﹐等價於：@{}﹐比如：閒﹐表達式爲：門{月}；

%{}：表示外包圍結構﹐比如：爽﹐表達式爲：大%{2^(㐅)2^(㐅)}﹐「㕚」可表示爲「又{丶}%{丶}」；

()：用以包含構字字根﹐單獨一个字根成字的﹐可以不用；

數字n()：表示重復n次小括號中的字根﹐並以特定形式組合﹐「2(火)」表示「炏」﹐「3(火)」表示「焱」﹐「4(火)」表示「燚」﹐「2^(火)」表示「炎」﹐而「2<(火)」也表示「炏」﹐由於左右結構是默認優先構造方式﹐故方向符「<」可省略﹐一个構字因子中數字先於其它指示符；

?：表示變形。這个符号通常只用於隶化後的構字式中﹐如「火」在下可爲「灬」﹐表示爲「?火」；「刀」在右可爲「刂」﹐表示爲「?刀」；「辶」表示爲「?辵」；「氵」表示爲「?水」。這个符号是爲了給漢字圖形生成程序一个明確的指令。

#：表示順時針旋轉90度形﹐用「#又」表示「彐」〔由小篆字形得知〕﹐用「#目」表示「罒」；

%：表示截半﹐置於被截半的因子前﹐如：「%竹」表示「个」﹐「%艸」表示「屮」﹐默認是上下結構的截上式或左右結構的截左式﹐截下式表示爲「%-衣」表示「衣」的下半部分﹐這樣「睘」可表示爲「^(#目一口%-衣)」﹐「%-」與「-%」是等價的﹐同一字根前或括號前的運算符不分先後次序；

-：表示最接近的部首與默認的順序相反﹐必定與「<^%」連用﹐如:「-^(口今)」表示「含」；以「<(口今)」表示「吟」；也可用括号分別將各字根括起來：「-^(心(今))」；与「%」連用﹐表示截用字根的下半部分字形。

方括号[]：表示一个合成變異體﹐如在某些字裏﹐「享」的小篆爲「𦎫」或「𦎧」,合成後產生變異；本符号只用來標識小篆與隶化的差異。

$：表示串透﹐串透符應放在执行穿透的因子前﹐串透方向即離其最近的方向指示符所指的方向﹐被串透的因子是方向所指最近的一个因子﹐如果被串透的因子不是字根﹐則需要用圓括号將所有被串透的因子包含﹐同樣地﹐执行串透的因子若不是字根也需要用括号包含。如「-^($儿冂)」表示「冘」﹐「儿」是从「冂」的中部串透的﹐串透是沿構字方向延伸至透出。大多情况下﹐串透是上下結構的。「冄」的串透象是「冃」由内而外橫穿的﹐應表示爲「冂{$二}」﹐沒有指示串透方向表示延伸所有方向以串透外圍；「禸」可表示爲「冂{$-^厶}」﹐表示僅向上串透﹐「禸」是「厹」的隶化字﹐小篆可表示爲「^(九$-^厶)」。上下串透如果沒有處於中綫的筆劃﹐向上串透通常是执行串透的因子的中偏左偏上的綫條延伸﹐向下串透通常是执行串透的因子的中偏右偏下的綫條延伸。「^(匕$-^儿)」表示「兂」﹐而非「旡」。串透符意味着筆劃要出頭﹐所以用構字式「-^($-^(冂{$-^厶})日)」表示小篆字「禺」是可以的﹐書寫式應爲「^(日$-^(冂{$-^厶}))」﹐表示隶化字「禺」則不行。或用書寫式「^(日$-^_(冂{$-^厶}))」表示隶化後不出頭的「禺」。這樣就可用「^(弓$-^&lowbar;丨)」表示隶化的「弔」﹐下劃綫「&lowbar;」指示綫頭延伸至平齊。但是﹐不建議使用這種描述﹐凡有串透的字形應盡量歸入複雜字形﹐不再拆分。

~：表示反形﹐左右鏡像﹐如「𠂢」是「永」的反形﹐可表示爲「~永」〔見小篆〕﹐但不適用於隸化後的字；

!：表示反形﹐關於原點對稱﹐卽旋轉180度形。比如﹐「步」的上下部﹐其上爲「止」﹐其下爲反「止」﹐表達式爲「!止」﹐卽「𣥂」〔見小篆〕﹐但不適用於隸化後的字；

星號&ast;：表示被包含﹐置于执行包含的因子前及被包含的因子後。如「口&ast;門」與「門{口}」將表示同一个字「問」﹐但兩个表達式所表達的部首字是不同的。可與括号一起使用﹐如：<(水舌)*(門)﹐表示执行包含或被包含的可能是一个複合因子。本符号只在構字式裏出現﹐在書寫式裏沒有。

## 第二﹐根據規則提取字根：

拆分嵌套原則：

一、**疊字原則**：先剖分疊形﹐比如把「驫」表達成「3(馬)」；

二、**最大原則**：次取最大部首形﹐優先分解出最大的有完整字義的字形﹐比如提取「頁」而非「貝」﹐不方便簡潔描述的字形盡量整个提取﹐比如：「我永𠂢兆州皮叚段曳老𣶒」；

三、**遞歸原則**：再在剩餘部分遞歸﹐根據第一第二兩原則﹐把剩餘部份繼續分解。

通過對《說文解字》中一萬一千一百一十一个小篆及籀文字形的研究﹐結論是2的9次方、卽512字足够容納所有的以字義拆分且小篆與隶化都能保持完整字形的字根。随之可以繼續進行拆分精簡﹐使得字根集關系：

常用字根　⊂　隸化字根　⊂　小篆字根。

常用字根目的在於放棄輸入疑難字罕用字的情況下﹐精簡字根以至於可以使用52~180个不同的字節編碼構建漢字。目前的結果﹐在保證字形字義的前提下﹐仍有約360个字根。比如小篆的字形「?𨸏」「?邑」分別表示左右耳旁「阝」﹐在隸化以後的字根中﹐可以合並﹐部首所在位置可以反推回小篆﹐不產生歧義。

而某些簡化的偏旁﹐如：金言示﹐毫無必要﹐省不了幾筆﹐平白多了新字形。言旁﹐若依草書法「有點方爲水﹐單挑卻是言」﹐反而是在混淆。示旁﹐筆畫不省﹐徒然多了新形﹐而且失了字義。爲了保持最少的字根及其變換﹐這種簡化的偏旁可以考慮精簡。

## 第三﹐需要有一个自動化造字與顯示程序﹐使得當字體庫缺少字體時﹐可以根據輸入的構字表達式使用該字體庫中的字根矢量圖構建新字。這樣﹐卽使是生僻字也能輸入了。

〔目前可以構建﹐但字體不好看﹐需要有精於圖形計算的人﹐或至少我需要找着一个縮放字形的同時可以保持筆畫粗細的轉換函數。實現：將字根縮放並移動至相應位置﹐字根的矢量圖是一閉合的曲綫﹐根據閉合的曲綫的中心綫塌縮或澎漲。〕

方法一﹐原閉合曲綫的關鍵節點在縮放後可能沒有增減﹐可以據此調整字體綫寬。〔已試﹐不可行﹐節點數量有變〕

方法二﹐通過水平和垂直掃描﹐縮放後﹐通過曲綫的節點﹐作水平綫及垂直綫﹐計算其交點﹐從而估算變化。〔待驗〕

方法三﹐近來欣見**可變字體 variable font** 漸漸實現﹐也給「漢字形義正則法」的實現帶來了絕佳助力。那麼﹐等待一个合適的字體發佈﹐就可以實現本文的想法了。

## 第四﹐可以根據構字表達式設計**一種新的編碼**。

比如：若「人」的編碼爲AA﹐「象」的編碼爲「BB」﹐則「像」的編碼爲「<(人象)」卽「AABB」。可用類似於UTF8編碼的方法作爲多字節的編碼的存儲方案。這樣的編碼方案有个好處是可以搜索含有同一个字根的漢字﹐比如搜索偏旁部首相同的字；缺點在於編碼的非連續性及編碼長度不固定性﹐這將導致最終應用可能還是一種輸入法或是一種中間應用編碼。爲了扩大適用性﹐編碼方案需與unicode及gb18030有編碼映射表。

漢字形義正則表達式使用「<(山夆)」表示「峰」﹐「^(山夆)」表示「峯」。「峯峰」是異體字﹐使用 OpenType字體可以多个異體字使用同一編碼。

以具有完整字義的字形把漢字分解。這樣﹐如果要檢索含有某个字形〔比如「金」字旁〕的漢字就很容易﹐就象想要搜索包含某特定部份〔比如前綴或後綴〕的英文單詞那樣。對漢字進行有序化研究就比較方便了。

## 第五﹐通過完成對所有漢字的拆解及統計﹐盡量地將一个漢字的各个字根分布在不同的按鍵﹐這樣﹐輸入的重碼率就會下降。

如果希望鍵盤輸入時可以顯性指示漢字結構﹐可以考慮采用日本鍵盤﹐因爲日本鍵盤比美國鍵盤多出三个鍵〔兩个 ALT鍵間〕﹐可加以利用而不需重新設計硬件。可以考慮將十天干「甲乙丙丁戊己庚辛壬癸」對應「1234567890」數字键；也可考慮按照「木(艸竹朩)火土金(玉石)水」、「衣食(禾麥米豆瓜田)住(舍門戶广厂宀)用(刀弓矢戈矛斤戉匕网臼瓦皿缶鼎鬲几冊貝巾革斗)行(舟車彳亍廴辵止走)」、「豸〔鼠牛虎兔龍它馬羊犬豕象鹿〕人(我儿大夫)虫(黽)鳥(隹燕)魚(龜)」﹐「音心鬼示言」這樣按某種規律編組在鍵盤；可考慮將「龍象」對應鍵盤的Z鍵﹐同時作爲輸入法中的萬能替代鍵〔模糊查詢〕。

# 應用前景：

輸入法；通過修改少量的字形﹐自動化批量生成字體；通過修改可以簡化的部份﹐有序化演變漢字；漢字綫性編碼。

# 結束語：

「漢字形義正則法」是一个可行性方案﹐昔年王永民的五筆、王選的激光照排給漢字的計算機處理打開一扇窗﹐希望這也是。本人於約2012年初步完成研究後﹐因種種瑣事就此擱置。亦因个人能力問題﹐導致𨿽有想法﹐卻無法很好地實現〔比如 llvm 實現前﹐我亦有過相同或相似的想法﹐卽將任意語言編寫的代碼﹐先編譯成中間碼再編譯成各平臺的可執行文件。但沒有能力實現﹐柰何。〕 。這麼多年來﹐似乎仍未有人有此想法。人們多是從輸入法編碼方法作研究﹐近年來有些網站使用「表意文字描述字符」U+2FF0~U+2FFB來描述漢字﹐仍未考慮讓計算機自行描劃文字﹐讓漢字可以象字母文字那樣自由輸入。謹以此文引玉﹐謝謝。

# 參考資料：

UTF8編碼﹐表意文字描述字符〔⿰⿱⿲⿳⿴⿵⿶⿷⿸⿹⿺⿻〕﹐正則表達式﹐可變字體 variable font 。

# 版權說明：

本文適用於創意共享 CC4.0 協議﹐僅保留署名權。

<a rel="license" href="http://creativecommons.org/licenses/by/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>.
