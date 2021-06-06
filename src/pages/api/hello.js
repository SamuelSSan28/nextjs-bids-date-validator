import puppeteer from 'puppeteer'


export default async (req, res) => {
  if (req.method === 'GET') {
    const browser = await puppeteer.launch({headless:false});
    
    try {
        const page = await browser.newPage();
        await page.goto('https://sistemas.tce.pi.gov.br/muralic/', {waitUntil: 'load'});

        //fazer 100 por dia loop
        await page.evaluate(() => {
            const dataAberturaInicial_input = document.querySelector('#tvPrincipal\\:dataAberturaInicial_input');

            dataAberturaInicial_input.value = "01/06/2020"
            
        });

        let lista_ids_licitacoes = []

        await page.click('#btnPesquisar');

        await page.waitForTimeout(800);

        lista_ids_licitacoes = await page.evaluate(() => {

            const lista_licitacoes = document.querySelector("#formListaLic\\:listaLic_data"); //listar processos

            const lista_butoes = lista_licitacoes.getElementsByTagName("button");

            let lista_ids = []

            for (let index = 0; index < lista_butoes.length; index++) {
                const botao = lista_butoes[index];

                const function_to_string = botao.onclick.toString();

                if (function_to_string.includes('/muralic/detalhelicitacao.xhtml?')){

                    const id_licitacao = function_to_string.split("id=")[1].split("'")[0]  //pegar o id no botão de cada processo
                
                    lista_ids.push(id_licitacao);
                }
            }
            return lista_ids;
            
        });


        for (let index = 0; index < lista_ids_licitacoes.length; index++) {
            const id_licitacao = lista_ids_licitacoes[index];
            
            await page.goto(`https://sistemas.tce.pi.gov.br/muralic/detalhelicitacao.xhtml?id=${id_licitacao}`, {waitUntil: 'load'});
            
        }


        //acessar a nova pagina com os detalhes

        //pegar as informaçãoes

        //clicar no botão para pegar as datas


  
        await browser.close();
        res.status(200).json({ lista_ids_licitacoes })
	} catch (error) {
       //await browser.close();
        res.status(200).json({ error:error.message })
	}
    
  }else{
    res.status(404).send()
  } 
  
}


