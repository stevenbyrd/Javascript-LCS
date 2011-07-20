str0Highlights	= '';
str1Highlights	= '';

function compare(s0, s1)
{
	str0 = s0.split(' ');
	str1 = s1.split(' ');
	
	diff(str0, str1);
}

function diff(s0, s1)
{
	str0Highlights	= '<span class="highlight">';
	str1Highlights	= '<span class="highlight">';
	
	if((s0 == null) 	||
	   (s1 == null)		||
	   (s0.length == 0)	||
	   (s1.length == 0))
	{
		str0Highlights	= str0Highlights + 'Error comparing documents: one or both documents not set';
		str1Highlights	= str1Highlights + 'Error comparing documents: one or both documents not set';
	}
	else
	{
		if(((s0.length == 1) && (s0[0] == '')) ||
		   ((s1.length == 1) && (s1[0] == '')))
		{
			str0Highlights	= str0Highlights + 'Error comparing documents: one or both documents were BLANK';
			str1Highlights	= str1Highlights + 'Error comparing documents: one or both documents were BLANK';
		}
		else
		{
			table 		= [];
			nullCell	= new Cell();
			
			//prepopulate the first row and first column with blank strings
			for(col = 0; col <= s0.length; col++)
			{
				table[col]		= [nullCell]
			}
			
			for(row = 1; row <= s1.length; row++)
			{
				table[0][row]	= nullCell;
			}
			
			
			//start finding the LCS
			for(row = 1; row <= s1.length; row++)
			{	
				for(col = 1; col <= s0.length; col++)
				{	
					//get the words
					w0 	= s0[col - 1];
					w1 	= s1[row - 1];
					c	= new Cell();
					
					if(w0 == w1)
					{	
						node 	= new LCSNode((col - 1), (row - 1));
						upLeft 	= table[col - 1][row - 1];	//cell
						
						if(upLeft.lcsList.length == 0)
						{
							//[col][row] should be a new array, with one lcs in it
							c.lcsList[0] = [node];
						}
						else
						{
							//copy the list of LCSs from [col-1][row-1], and add 'node' to it
							c.lcsList = upLeft.lcsList;
							
							for(lcs = 0; lcs < c.lcsList.length; lcs++)
							{
								c.lcsList[lcs] = c.lcsList[lcs].concat([node]);
							}
						}
					}
					else
					{
						up		= table[col][row - 1];	//cell
						left	= table[col - 1][row];	//cell
						
						if((up.lcsList.length == 0) || (left.lcsList.length == 0))
						{
							if(up.lcsList.length != 0)
							{
								c.lcsList = up.lcsList.concat([]);
							}
							else if(left.lcsList.length != 0)
							{
								c.lcsList = left.lcsList.concat([]);
							}
						}
						else
						{
							if(up.lcsList[0].length > left.lcsList[0].length)
							{
								c.lcsList = up.lcsList.concat([]);
							}
							else if(up.lcsList[0].length < left.lcsList[0].length)
							{
								c.lcsList = left.lcsList.concat([]);
							}
							else
							{
								c.lcsList = up.lcsList.concat(left.lcsList);
							}
						}
					}
					
					table[col][row] = c;
				}
			}
			
			lastCell	= table[s0.length][s1.length];
			chosenLCS	= null;
			
			if(lastCell.lcsList.length > 0)
			{				
				minClusters = lastCell.lcsList[0].length;
				
				for(lcs = 0; lcs < lastCell.lcsList.length; lcs++)
				{
					numClusters = 0;
					
					list = lastCell.lcsList[lcs];
					
					for(i = 1; i < list.length; i++)
					{
						if(list[i].str0Index != list[i - 1].str0Index + 1)
						{
							numClusters++;
						}
						
						if(list[i].str1Index != list[i - 1].str1Index + 1)
						{
							numClusters++;
						}
					}
					
					if(numClusters < minClusters)
					{
						chosenLCS = list;
					}
				}
			}
			
			if(chosenLCS != null)
			{
				for(node = 0; node < chosenLCS.length; node++)
				{
					//document.write('str0Index: ' + chosenLCS[node].str0Index);
					s0[chosenLCS[node].str0Index] = '</span>' + s0[chosenLCS[node].str0Index] + '<span class="highlight">';
					s1[chosenLCS[node].str1Index] = '</span>' + s1[chosenLCS[node].str1Index] + '<span class="highlight">';
				}
				
				for(word = 0; word < s0.length; word++)
				{
					str0Highlights = str0Highlights + '</span> <span class="highlight">' + s0[word];
				}
				
				for(word = 0; word < s1.length; word++)
				{
					str1Highlights = str1Highlights + '</span> <span class="highlight">' + s1[word];
				}
			}
			else
			{
				str0Highlights = str0Highlights + 'Error comparing documents: error in main comparison';
				str1Highlights = str1Highlights + 'Error comparing documents: error in main comparison';
			}
		}
	}
	
	str0Highlights = str0Highlights + '</span>';
	str1Highlights = str1Highlights + '</span>';
}


function Cell()
{
	this.lcsList = [];
}


function LCSNode(s0i, s1i)
{
	this.str0Index = s0i;
	this.str1Index = s1i;
}