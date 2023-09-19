describe('core - search()', function() {
	dt.libs({
		js: ['jquery', 'datatables'],
		css: ['datatables']
	});

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Exists and is a function', function() {
			let table = $('#example').DataTable();
			expect(typeof table.search).toBe('function');
		});

		dt.html('basic');
		it('Getter returns a string', function() {
			let table = $('#example').DataTable();
			expect(typeof table.search()).toBe('string');
		});

		dt.html('basic');
		it('Setter returns an API instance', function() {
			var table = $('#example').DataTable();
			expect(table.search('test') instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Getter', function() {
		dt.html('basic');
		it('Returns empty string if no search', function() {
			let table = $('#example').DataTable();
			expect(table.search()).toBe('');
		});

		dt.html('basic');
		it('Gets the current search (set by API)', function() {
			let table = $('#example').DataTable();
			table.search('Airi').draw();
			expect(table.search()).toBe('Airi');
		});
	});

	describe('Setter', function() {
		dt.html('basic');
		it('Does not affect column searches', function() {
			let table = $('#example').DataTable();
			table.search('Fred');

			for (let i = 0; i < table.columns().count(); i++) {
				expect(table.column(i).search()).toBe('');
			}
		});

		dt.html('basic');
		it('Search added to the input element', function() {
			let table = $('#example').DataTable();
			table.search('Fred');

			expect($('.dt-search input').val()).toBe('Fred');
		});

		dt.html('basic');
		it('Table remains the same before the draw()', function() {
			let table = $('#example').DataTable();
			table.search('Angelica');

			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});

		dt.html('basic');
		it('Search applied after the draw()', function() {
			let table = $('#example').DataTable();
			table.search('Angelica').draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Angelica Ramos');
		});

		dt.html('basic');
		it('Regex search needs to be enabled', function() {
			let table = $('#example').DataTable();
			table.search('^A.*s$', false).draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('No matching records found');
		});

		dt.html('basic');
		it('Smart search on by default', function() {
			let table = $('#example').DataTable();
			table.search('ramos angelica', false).draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Angelica Ramos');
		});

		dt.html('basic');
		it('Can disable smart search', function() {
			let table = $('#example').DataTable();
			table.search('ramos angelica', false, false).draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('No matching records found');
		});

		dt.html('basic');
		it('Case insensitivity by default', function() {
			let table = $('#example').DataTable();
			table.search('angelica', false, true).draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Angelica Ramos');
		});

		dt.html('basic');
		it('Can disable case sensitivity', function() {
			let table = $('#example').DataTable();
			table.search('angelica', false, true, false).draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('No matching records found');
		});

		dt.html('basic');
		it('Non-case sensitive regex search', function() {
			let table = $('#example').DataTable();
			table.search('^a.*s$', true, false, false).draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('No matching records found');
		});

		dt.html('basic');
		it('Smart search - quoted', function() {
			let table = $('#example').DataTable();
			table.search('"Chief O"').draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Fiona Green');
		});

		it('Smart search - quoted (without the codes to prove grouping', function() {
			let table = $('#example').DataTable();
			table.search('Chief O').draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Angelica Ramos');
		});

		it('Smart search - quoted and individual', function() {
			let table = $('#example').DataTable();
			table.search('"New York" Yuri').draw();
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Yuri Berry');
		});

		it('Smart search - negative', function() {
			let table = $('#example').DataTable();
			table.search('!Airi').draw();

			expect($('.dt-info').text()).toBe('Showing 1 to 10 of 56 entries (filtered from 57 total entries)');
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Angelica Ramos');
		});

		it('Smart search - negative and positive', function() {
			let table = $('#example').DataTable();
			table.search('!Airi San').draw();

			expect($('.dt-info').text()).toBe('Showing 1 to 10 of 14 entries (filtered from 57 total entries)');
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Ashton Cox');
		});

		it('Smart search - negative quoted', function() {
			let table = $('#example').DataTable();
			table.search('!"New York"').draw();

			expect($('.dt-info').text()).toBe('Showing 1 to 10 of 46 entries (filtered from 57 total entries)');
			expect($('#example tbody tr:eq(0) td:eq(0)').text()).toBe('Airi Satou');
		});
	});

	describe('Regex search', function() {
		let table;

		dt.html('basic');

		it('Can set a regex search', function() {
			table = $('#example').DataTable();
			table.search(/A.*s/).draw();
			
			expect($('#example tbody td').eq(0).text()).toBe('Angelica Ramos');
		});

		it('Case insensitive regex search', function() {
			table.search(/a.*s/i).draw();

			expect($('#example tbody td').eq(0).text()).toBe('Airi Satou');
		});

		it('Search spans the whole row', function() {
			table.search(/\bAcc.*33/i).draw();

			expect($('#example tbody td').eq(0).text()).toBe('Airi Satou');
		});

		it('Writes regex string value into the search box', function() {
			expect($('div.dt-search input').val()).toBe('/\\bAcc.*33/i');
		});
	});

	describe('Function search', function() {
		let table;

		dt.html('basic');

		it('Can set a function search', function() {
			table = $('#example').DataTable();
			table.search(d => d.includes('Caesar')).draw();
			
			expect($('#example tbody td').eq(0).text()).toBe('Caesar Vance');
		});

		it('Call again replaces previous', function() {
			table.search(d => d.includes(' 33 ')).draw();
			
			expect($('#example tbody td').eq(0).text()).toBe('Airi Satou');
		});

		it('Data for full row is given', function() {
			table.search(d => d.includes('Edinburgh') && d.includes('Cedric')).draw();
			
			expect($('#example tbody td').eq(0).text()).toBe('Cedric Kelly');
		});

		it('Does not write a value into the search box', function() {
			expect($('div.dt-search input').val()).toBe('');
		});

		it('String search', function() {
			$('div.dt-search input').val('New York').trigger('input');

			expect($('#example tbody td').eq(0).text()).toBe('Brielle Williamson');
		});

		it('Using a search function clears the input', function() {
			table.search(d => d.includes('Caesar')).draw();
			
			expect($('div.dt-search input').val()).toBe('');
			expect($('#example tbody td').eq(0).text()).toBe('Caesar Vance');
		});

		it('Second parameter is the rows data object', function() {
			table = $('#example').DataTable();
			table.search((d, row) => row[3] == '61').draw();

			expect($('#example tbody td').eq(0).text()).toBe('Brielle Williamson');
		});
	});
});
